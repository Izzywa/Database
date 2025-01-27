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
    
@api_view(['GET', 'POST'])
def patient_list(request):
    if request.method == 'GET':
        patients = Patients.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            todo = serializer.save()
            response_data = {
                'message': 'Todo created successfully',
                'data': serializer.data
            }
            return Response(response_data, status=201)
        return Response(serializer.errors, status=400)