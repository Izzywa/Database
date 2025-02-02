import json
from datetime import datetime
from django.db import connection
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .models import Patients, Countries, DialCodes
from .serializers import PatientSerializer, CountrySerializer, DialCodeSerializer

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
@api_view(['GET'])
def patient_list(request,pt_id=None):
    if request.method == 'GET':
        if pt_id is None:
            patients = Patients.objects.all()
            if not request.user.is_staff:
                patients = patients.filter(deleted=0)
                
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
        birth_date = datetime.strptime(birth_date, '%d/%m/%Y')
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
def visit_prescription_list(request, pt_id=None):
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
    with connection.cursor() as cursor:
        cursor.callproc('visit_prescription_by_pt_id', (pt_id,))
        results = cursor.fetchall()
        
        visit_and_prescriptions = []
        if len(results) != 0:
            for result in results:
                try:
                    visit_note = result[1].split('<><>')
                except:
                    visit_note = result[1]
                
                try:
                    prescriptions = result[2].split(',')
                except:
                    prescriptions = result[2]
                    
                visit_and_prescriptions.append(
                    {
                        'date': result[0],
                        'visit_note': visit_note,
                        'prescriptions': prescriptions
                    }
                )
    
    return Response(visit_and_prescriptions, status=200)

@login_required(login_url="/login")
@api_view(['GET'])
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
        
    with connection.cursor() as cursor:
        if name == 'official':
            cursor.callproc('allergy_official_name_by_pt_id', (pt_id,))
        else:
            cursor.callproc('allergy_trade_name_by_pt_id', (pt_id,))
        
        results = cursor.fetchall()
            
        return Response(results, status=200)

@login_required(login_url="/login")
@api_view(['GET'])
def compliance_list(request, pt_id):
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
        
    with connection.cursor() as cursor:
        cursor.callproc('diagnosis_compliance_by_pt_id', (pt_id,))
        
        results = cursor.fetchall()
        comp_list = []
        for result in results:
            try:
                diagnoses = result[2].split(',')
            except:
                diagnoses = result[2]
            
            try:
                usage = result[3].split(',')
            except:
                usage = result[3]
            comp_list.append({
                'date': result[0],
                'ab': result[1],
                'diagnoses': diagnoses,
                'usage': usage
                
            })
            
        return Response(comp_list, status=200)