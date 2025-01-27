from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Patients
from .serializers import PatientSerializer

# Create your views here.
def index(request):
    return JsonResponse({'message': 'index'})

def login(request):
    if request.method == 'POST':
        return JsonResponse({"message":"success"}, status=200)
    else:
        return HttpResponseRedirect(reverse("frontend:index"))
    
def auth_check(request):
    if request.user.is_authenticated:
        return JsonResponse({'authenticated': True}, status=200)
    else:
        return JsonResponse({'authenticated': False}, status=200)
    
@api_view(['GET'])
def patient_list(request,pt_id=None):
    if request.method == 'GET':
        if pt_id is None:
            patients = Patients.objects.all()
            serializer = PatientSerializer(patients, many=True)
            return Response(serializer.data)
        else:
            try:
                patient = Patients.objects.get(id=pt_id)
                serializer = PatientSerializer(patient)
                return Response(serializer.data)
            except Patients.DoesNotExist:
                return JsonResponse({'message':'patient does not exist'}, status=404)
    
    else:
        return HttpResponseRedirect(reverse("backend:patients_list"))