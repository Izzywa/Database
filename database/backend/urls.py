from django.urls import path

from . import views

app_name = 'backend'

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login, name='login'),
    path('patients', views.patient_list, name="patients_list"),
    path('patients/<int:pt_id>', views.patient_list, name="patient_by_id")
]