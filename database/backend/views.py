import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from .models import Patients
from .serializers import PatientSerializer

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
    