import json
import heapq
from datetime import datetime
from django.db import connection, IntegrityError
from django.db.models import Count
from django.contrib.auth import authenticate, login, logout
from django.core.paginator import Paginator, PageNotAnInteger
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .models import Patients, Countries, DialCodes, Antibiotics, Synonyms, Allergies, Diagnoses, AbUsage, PrescriptionDiagnosis, Compliance
from .serializers import *

def index(request):
    return JsonResponse({'message': 'index'})

def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'error': False,
                'message': 'Successfully logged in'
            })
        else:
            return JsonResponse({
                'error': True,
                'message': 'Invalid username and/or password'
            }, status=409)
    else:
        return HttpResponseRedirect(reverse("frontend:index"))
    
@login_required(login_url="/login")
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("frontend:index"))
    
def auth_check(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True}, status=200)
    else:
        return JsonResponse({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)
    
@login_required(login_url="/login")
@api_view(['GET', 'POST'])
def patient_list(request,pt_id=None):
    if request.method == 'GET':
        if pt_id is None:
            patients = Patients.objects.all().order_by('-id')
            if not request.user.is_staff:
                patients = patients.filter(deleted=0).order_by('-id')
                
            serializer = PatientSerializer(patients, many=True)
            return Response(serializer.data, status=200)
        else:
            try:
                if request.user.is_staff:
                    patient = Patients.objects.get(id=pt_id)
                else:
                    patient = Patients.objects.get(id=pt_id, deleted=0)
                serializer = PatientSerializer(patient)
                
                return Response(serializer.data, status=200)
            except Patients.DoesNotExist:
                return JsonResponse({
                    'error': True,
                    'message':f'Patient with id {pt_id} does not exist'
                    }, status=404)
    elif request.method == 'POST':
        data = request.data
        serializer = PatientPostSerializer(data=data)
        if serializer.is_valid():
            patient = serializer.save()
            return Response({
                'message': 'Patient Registered',
                'patient_id': patient.id
                }, status=200)
            
        return Response ({
            'errors': serializer.errors,
            'data': data
            }, status=400)
    
    else:
        return HttpResponseRedirect(reverse("backend:patients_list"))
    
@api_view(['GET'])
def country_list(request):
    if request.method == 'GET':
        countries = Countries.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data, status=200)

@api_view(['GET'])
def dial_code_list(request):
    if request.method == 'GET':
        dial_codes = DialCodes.objects.all()
        serializer = DialCodeSerializer(dial_codes, many=True)
        return Response(serializer.data, status=200)
    
@login_required(login_url="/login")
@api_view(['GET'])
def search_patients(request):
    if request.method == 'GET':
        name = request.GET.get('name', '')
        id = request.GET.get('id', None)
        birth_date = request.GET.get('bd', None)
        email = request.GET.get('email', '')
        resident_country = request.GET.get('rc', None)
        birth_country = request.GET.get('bc', None)
        dial_code = request.GET.get('dc', None)
        phone_number = request.GET.get('phone', None)
        
        patients = Patients.objects.filter(
            full_name__icontains=name, 
            email__icontains=email
            )
        if id is not None:
            patients = patients.filter(id=int(id))
        
        if birth_date is not None:
            birth_date = datetime.strptime(birth_date, '%Y-%m-%d')
            patients = patients.filter(birth_date=birth_date)
        
        if resident_country is not None:
            patients = patients.filter(resident_country_code = resident_country)
        
        if birth_country is not None:
            patients = patients.filter(birth_country_code = birth_country)
        
        if dial_code is not None:
            patients = patients.filter(dial_code = dial_code)
        
        if phone_number is not None:
            phone_number = int(phone_number)
            patients = patients.filter(phone = phone_number)
        
        searilizer = PatientSerializer(patients, many=True)
            
        return Response({
            'patients': searilizer.data
            },status=200)
    
@login_required(login_url="/login")
@api_view(['GET'])
def visit_prescription_list(request, pt_id=None, date=None):
    try:
        if request.user.is_staff:
            patient = Patients.objects.get(id=pt_id)
        else:
            patient = Patients.objects.get(id=pt_id, deleted=0)
    except Patients.DoesNotExist:
        return Response({
            'error': True,
            'message': f'Patient with id #{pt_id} does not exist'
        }, status=404)
    
    if date is None:  
        with connection.cursor() as cursor:
            cursor.callproc('visit_prescription_by_pt_id', (pt_id,))
            dates = cursor.fetchall()
            
        if dates:
            dates = [date[0] for date in dates]
        else:
            dates = []
    else:
        try:
            dates = [datetime.strptime(date, '%Y-%m-%d')]
        except ValueError:
            return Response({
                'error': True,
                'message': 'Not valid date given.'
            })
        
    serializer = VisitPrescriptionSerializer(patient, context={'dates':dates, 'is_staff': request.user.is_staff})
    if date is not None:
        return Response({
            'data': serializer.data,
            'is_staff': request.user.is_staff
        }, status=200)
    
    vp_pagination = Paginator(serializer.data['dates'],5)
    page = request.GET.get('page', 1)
    try:
        vp_by_page = vp_pagination.page(page).object_list
    except:
        vp_by_page = []
    
    return Response ({
        'num_pages': vp_pagination.num_pages,
        'result': vp_by_page,
        }, status=200)

@login_required(login_url="/login")
@api_view(['GET', 'POST', 'DELETE'])
def allergies_list(request, pt_id=None, name='official'):
    try:
        if request.user.is_staff:
            patient = Patients.objects.get(id=pt_id)
        else:
            patient = Patients.objects.get(id=pt_id, deleted=0)
    except Patients.DoesNotExist:
        return Response({
            'error': True,
            'message': 'Patient id does not exist'
        }, status=404)
        
    if request.method == 'GET':
        allergies = patient.allergies.all().order_by('ab')
        if name == 'official':
            results = [allergy.ab.serialize() for allergy in allergies]
        else:
            results = []
            for allergy in allergies:
                ab_synonyms = allergy.ab.synonyms.all()
                for ab_synonym in ab_synonyms:
                    results.append(ab_synonym.serialize())
                    
        allergies_paginator = Paginator(results, 10)
        page = request.GET.get('page', 1)
        try:
            result_by_page = allergies_paginator.page(page).object_list
        except:
            result_by_page = []
        return Response({
            'num_pages': allergies_paginator.num_pages,
            'result': result_by_page
            }, status=200)
            
    elif request.method == 'POST':
        ab = request.data["ab"]
        try:
            antibiotic = Antibiotics.objects.get(ab=ab)
        except Antibiotics.DoesNotExist:
            return Response({
                'error': True,
                'message': 'Antibiotic does not exist'
            }, status=400)
            
        try:
            patient.allergies.create(patient=patient, ab=antibiotic)
        except IntegrityError:
            return Response({
                "error": True,
                'message': f'Patient already has allergy of {antibiotic.name} listed'
            }, status=409)
        return Response({
            "error": False,
            "message": f"Allergy of antibiotic {antibiotic.name} successfuly added"
            }, status=200)
    
    elif request.method == 'DELETE':
        ab = request.data['ab']
        try:
            allergy_obj = patient.allergies.get(ab=ab)
        except Allergies.DoesNotExist:
                return Response({
                    'error': True,
                    'message': f'Patient has no allergy of {ab}'
                })
        allergy_obj.delete()
        return Response ({
            'error': False,
            'message': f'Allergy of {allergy_obj.ab.name} deleted'
            }, status=200)

@login_required(login_url="/login")
@api_view(['GET', 'POST', 'DELETE', 'PUT'])
def compliance_list(request, pt_id=None, pr_id=None):
    if pr_id is not None:
        try:
            if request.user.is_staff:
                prescription = Prescriptions.objects.get(id=pr_id)
            else:
                prescription = Prescriptions.objects.get(id=pr_id, deleted=0)
        except Prescriptions.DoesNotExist:
            return Response({
                'error': True,
                'message': f"Prescription with id #{pr_id} does not exist"
            })
    if pt_id is not None:
        try:
            if request.user.is_staff:
                patient = Patients.objects.get(id=pt_id)
            else:
                patient = Patients.objects.get(id=pt_id, deleted=0)
        except Patients.DoesNotExist:
            return Response({
                'error': True,
                'message': 'Patient id does not exist'
            }, status=404)
        
    if request.method == 'GET':
        prescription = patient.prescriptions.all().order_by('-prescription_date')
        if not request.user.is_staff:
            prescription = prescription.filter(deleted=0)
            
        serializer = PrescriptionSerializer(prescription, many=True)
        prescription_paginator = Paginator(serializer.data, 5)
        page = request.GET.get('page', 1)
        try:
            prescription_by_page = prescription_paginator.page(page).object_list
        except:
            prescription_by_page = []
                
        return Response({
            'num_pages': prescription_paginator.num_pages,
            'result': prescription_by_page
            }, status=200)
        
    elif request.method == 'POST':
        data = request.data
        if datetime.strptime(data['date'], '%Y-%m-%d') > datetime.today():
            return Response({
                'error': True,
                'message': 'Prescription date cannot be in the future.'
            }, status=409)
        
        try:
            dose = Dosage.objects.get(id=data['dose'])
        except Dosage.DoesNotExist:
            return Response({
                'error': True,
                'message': 'Dose does not exist'
            }, status=404)
            
        
        try:
            new_prescription = patient.prescriptions.create(
                patient=patient,
                dose=dose,
                prescription_date=data['date']
                )
        except:
            return Response({
                'error': True,
                'message': 'Data submitted not valid'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        for diagnosis in data['diagnoses']:
            try:
                diagnosis_obj = Diagnoses.objects.get(diagnosis=diagnosis)
            except Diagnoses.DoesNotExist:
                return Response({
                    'error': True,
                    'message': f'Diagnosis of {diagnosis} does not exist'
                }, status=409)
            new_prescription.diagnosis.create(prescription=new_prescription, diagnosis=diagnosis_obj)
            
        for compliance in data['compliance']:
            try:
                compliance_obj = AbUsage.objects.get(use=compliance)
            except AbUsage.DoesNotExist:
                return Response({
                    'error': True,
                    'message': f'Compliance '
                }, status=409)
            new_prescription.compliance.create(prescription=new_prescription, use=compliance_obj)
            
        return Response({
            'error': False,
            'message': f'Successfuly created prescription with id #{new_prescription.id}'
            }, status=200)
    
    elif request.method == 'PUT':
        
        serializer = PrescriptionSerializer(prescription)
        
        data = request.data 
        diagnoses = data['diagnoses']
        compliance = data['compliance']
        
        diagnoses_to_delete = set(serializer.data['diagnosis']).difference(set(diagnoses))
        diagnoses_to_add = set(diagnoses).difference(set(serializer.data['diagnosis']))
        compliance_to_delete = set(serializer.data['compliance']).difference(set(compliance))
        compliance_to_add = set(compliance).difference(set(serializer.data['compliance']))
        
        for diagnosis in diagnoses_to_delete:
            try:
                delete_diagnosis = Diagnoses.objects.get(diagnosis=diagnosis)
                item = prescription.diagnosis.get(diagnosis=delete_diagnosis)
                item.delete()
            except Diagnoses.DoesNotExist:
                return Response ({
                    "error": True,
                    "message": f"No diagnosis in list named {diagnosis}"
                }, status=400)
                
        for diagnosis in diagnoses_to_add:
            try:
                add_diagnosis = Diagnoses.objects.get(diagnosis=diagnosis)
                prescription.diagnosis.create(prescription=prescription, diagnosis=add_diagnosis)
            except Diagnoses.DoesNotExist:
                return Response ({
                    "error": True,
                    "message": f"No diagnosis in list named {diagnosis}"
                }, status=400)
                
        for compliance in compliance_to_delete:
            try:
                delete_compliance = AbUsage.objects.get(use=compliance)
                item = prescription.compliance.get(use=delete_compliance)
                item.delete()
            except AbUsage.DoesNotExist:
                return Response ({
                    "error": True,
                    "message": f"No compliance in list named {compliance}"
                }, status=400)
                
        for compliance in compliance_to_add:
            try:
                add_compliance = AbUsage.objects.get(use=compliance)
                prescription.compliance.create(prescription=prescription, use=add_compliance)
            except AbUsage.DoesNotExist:
                return Response ({
                    "error": True,
                    "message": f"No compliance in list named {compliance}"
                }, status=400)
            
        return Response ({
            "message": f"successfully edited prescription #{pr_id}",
        }, status=200)
        
    elif request.method == 'DELETE':
        if request.user.is_staff and prescription.deleted == 1:
            prescription.delete()
        else:
            prescription.deleted = 1
            prescription.save()
        return Response({
            'message': f"successfully deleted prescription id #{pr_id}"
        })
    
@api_view(['GET'])
def antibiotics_list(request):
    name = request.GET.get('name', 'official')
    if name == 'official':
        antibiotics = Antibiotics.objects.all()
        serializer = AntibioticSerializer(antibiotics, many=True)
    else:
        antibiotics = Synonyms.objects.all().order_by('ab')
        serializer = SynonymsSerializer(antibiotics, many=True)
        
    return Response(serializer.data, status=200)
    
@api_view(['GET'])
def diagnoses_list(request):
    diagnoses = Diagnoses.objects.all()
    serializer = DiagnosesSerializer(diagnoses, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
def abusage_list(request):
    abusage = AbUsage.objects.all()
    serializer = AbUsageSerializer(abusage, many=True)
    return Response(serializer.data, status=200)

@api_view(['GET'])
def dose_list(request, ab):
    ab = Antibiotics.objects.get(ab=ab)
    dosage = ab.dosage.all()
    serializer = DosageSerializer(dosage, many=True)
    return Response(serializer.data, status=200)


@login_required(login_url="/login")
@api_view(['DELETE', 'POST', 'PUT'])
def visit_note(request, visit_id=None):
    if visit_id is not None:
        try: 
            visit = Visits.objects.get(id=visit_id)
        except Visits.DoesNotExist:
            return Response({
                'error': True,
                'message': f'Visti with id #{visit_id} does not exist'
            })
    if request.method == 'DELETE':
        if request.user.is_staff and visit.deleted == 1:
            visit.delete()
            return Response({
                'error': False,
                'message': f'Successfully deleted note #{visit_id}.'
            })
        else:
            visit.deleted = 1
            visit.save()
            return Response({
                'error': False,
                'message': f'Successfully marked note #{visit_id} as deleted.'
            })
    
    elif request.method == 'POST':
        data = request.data
        try:
            patient = Patients.objects.get(id=data['patient'])
        except Patients.DoesNotExist:
            return Response({
                'error': True,
                'message': f'Patient with id #{data['patient']} does not exist.'
            })
        if not request.user.is_staff and patient.deleted == 1:
            return Response({
                'error': True,
                'message': 'User not authorised to add note to deleted patient'
            })
        serializers = VisitSerializer(data=data)
        if serializers.is_valid():
            try:
                patient.visits.create(patient=patient, note=data['note'], visit_date=data['visit_date'])
            except Exception as e:
                return Response({
                    'error': True,
                    'message': 'Not valid data'
                })

                
            return Response({
                'error': False,
                'message': 'Note successfuly created.',
                'data': data
            }, status=200)
        else:
            return Response({
                'error': True,
                'message': serializers.errors
            }, status=409)
            
    elif request.method == 'PUT':
        if visit.deleted == 1 and not request.user.is_staff:
            return Response({
                'error': True,
                'message': 'User not authorised to edit note marked deleted'
            }, status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = VisitSerializer(visit, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'error': False,
                'message': f"Succesfully updated visit note id #{visit_id}"
                
            })
        else:
            return Response({
                'error': True,
                'message': serializer.errors,
            })
    
@login_required(login_url="/login")    
@api_view(['GET'])    
def ab_stats(request):
    all = request.GET.get('all', None)
    if all is not None and all == 'true':
        ab_list = Antibiotics.objects.all()
        serializer = AllAntibioticStats(ab_list, many=True)
        return Response(serializer.data, status=200)
    else:
        all_prescriptions = Prescriptions.objects.all()
        count_all_prescriptions = all_prescriptions.count()
        top_5 = []
        doses = [prescription.dose.ab.name for prescription in all_prescriptions]
        for dose in set(doses):
            count = all_prescriptions.filter(dose__ab__name=dose).count()
            top_5.append({
                'ab': dose,
                'percentage': count/count_all_prescriptions * 100
            })
        
        top_5 = sorted(top_5, key=lambda item: item['percentage'], reverse=True)[:5]
        labels = [item['ab'] for item in top_5]
        data = [round(item['percentage'],2) for item in top_5]
            
        return Response({
            'labels' : labels, 
            'data': data
            }, status=200)
    
@login_required(login_url="/login")
@api_view(['GET'])
def diagnosis_stats(request):
    all = request.GET.get('all', None)
    
    if all is not None and all == 'true':
        diagnoses = Diagnoses.objects.all()
        serializer = AllDiagnosesStats(diagnoses, many=True)
        return Response(serializer.data, status=200)
        
    all_diagnoses = PrescriptionDiagnosis.objects.all()
    count_all_prescriptions = Prescriptions.objects.all().count()
    diagnosis_list = [diagnosis.diagnosis.diagnosis for diagnosis in all_diagnoses]
    
    top_5 = []
    for diagnosis in set(diagnosis_list):
        count = all_diagnoses.filter(diagnosis__diagnosis=diagnosis).count()
        top_5.append({
            'diagnosis': diagnosis,
            'percentage': count/count_all_prescriptions * 100
        })
    top_5 = sorted(top_5, key=lambda item: item['percentage'], reverse=True)[:5]
    
    return Response({
        'labels': [item['diagnosis'].capitalize() for item in top_5],
        'data': [round(item['percentage'],2) for item in top_5]
    }, status=200)
    
@login_required(login_url="/login")
@api_view(['GET'])
def compliance_stats(request):
    compliances = Compliance.objects.all()
    usage = AbUsage.objects.all()
    compliance_count = compliances.count()
    
    data = [] 
    for use in usage:
        count = compliances.filter(use=use).count()
        data.append(round(count/compliance_count * 100, 2))
        
    return Response({
        'data': data,
        'labels': [use.use.capitalize() for use in usage]
    }, status=200)

@api_view(['GET', 'POST'])
def test(request):
    all_prescriptions = Prescriptions.objects.all()
    count_all_prescriptions = all_prescriptions.count()
    top_5 = []
    doses = [prescription.dose.ab.name for prescription in all_prescriptions]
    for dose in set(doses):
        count = all_prescriptions.filter(dose__ab__name=dose).count()
        top_5.append({
            'ab': dose,
            'percentage': count/count_all_prescriptions * 100
        }, status=200)
        
    top_5 = sorted(top_5, key=lambda item: item['percentage'], reverse=True)[:5]
    return Response({
        'label': 'label',
        'list': top_5
        }, status=200)