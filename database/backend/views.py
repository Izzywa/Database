from django.shortcuts import render
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse

# Create your views here.
def index(request):
    return JsonResponse({'message': 'index'})

def login(request):
    if request.method == 'POST':
        return JsonResponse({"message":"success"}, status=200)
    else:
        return HttpResponseRedirect(reverse("frontend:index"))