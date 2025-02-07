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
    path('vp/<int:pt_id>/<str:date>', views.visit_prescription_list, name="vp_by_date"),
    path('allergies/<int:pt_id>/<str:name>', views.allergies_list, name="allergies_list"),
    path('allergies/<int:pt_id>', views.allergies_list, name="edit_allergies"),
    path('compliance/<int:pt_id>', views.compliance_list, name="compliance_list"),
    path('compliance/edit/<int:pr_id>', views.compliance_list, name="compliance_edit"),
    path('test', views.test, name="test"),
    path('ab_list', views.antibiotics_list, name="ab_list"),
    path('diagnoses', views.diagnoses_list, name="diagnoses_list"),
    path('abusage', views.abusage_list, name="abusage_list"),
    path('dose/<str:ab>', views.dose_list, name="dose_list")
]