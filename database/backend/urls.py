from django.urls import path, re_path

from . import views

app_name = 'backend'

urlpatterns = [
    path('', views.index, name='index'),
    path('login', views.login_view, name='login'),
    path('patients', views.patient_list, name="patients_list"),
    path('patients/<int:pt_id>', views.patient_list, name="patient_by_id"),
    path('auth_check', views.auth_check, name="auth_check"),
    path('logout', views.logout_view, name="logout"),
    path('countries', views.country_list, name="countries"),
    path('dial_codes', views.dial_code_list, name="dial_codes"),
    re_path(r'^patients/search$', views.search_patients, name="search_patients"),
    path('vp/<int:pt_id>', views.visit_prescription_list, name="vp"),
    path('allergies/<int:pt_id>/<str:name>', views.allergies_list, name="allergies_list"),
    path('compliance/<int:pt_id>', views.compliance_list, name="compliance_list"),
    path('test', views.test, name="test")
]