from datetime import date
from dateutil.relativedelta import relativedelta
from rest_framework import serializers
from .models import Patients, Countries, DialCodes, Prescriptions, Diagnoses, Compliance
        
class PatientSerializer(serializers.ModelSerializer):
    resident_country = serializers.ReadOnlyField()
    birth_country = serializers.ReadOnlyField()
    phone_number = serializers.ReadOnlyField()
    age = serializers.SerializerMethodField()
    
    class Meta:
        model = Patients
        fields = [
            'id', 
            'full_name', 
            'email',
            'age',
            'birth_date',
            'phone_number',
            'birth_country',
            'resident_country',
        ]
    
    def get_age(self, obj):
        today = date.today()
        age = relativedelta(today, obj.birth_date).years
        if age != 0:
            return f"{age} years"
        else:
            return f"{relativedelta(today, obj.birth_date).months} months"
        
class CountrySerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    class Meta:
        model = Countries
        fields = [
            'label',
            'value'
        ]
        
    def get_label(self, obj):
        return obj.name
    
    def get_value(self, obj):
        return obj.code
    
class DialCodeSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    class Meta:
        model = DialCodes
        fields = [
            'label',
            'value'
        ]
    def get_label(self, obj):
        country = obj.country_code.code
        return f"{obj.dial} ({country})"
    
    def get_value(self, obj):
        return obj.id
    
class DiagnosisSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    class Meta:
        model = Diagnoses
        fields = [
            'id',
            'name'
        ]
        
    def get_name(self, obj):
        return obj.diagnosis.diagnosis
        
class ComplianceSerializer(serializers.ModelSerializer):
    usage = serializers.SerializerMethodField()
    class Meta:
        model = Compliance
        fields = [
            'usage'
        ]
    
    def get_usage(self, obj):
        return obj.use.use
    
class PrescriptionSerializer(serializers.ModelSerializer):
    dose_str = serializers.ReadOnlyField()
    diagnosis = serializers.SerializerMethodField()
    compliance = serializers.SerializerMethodField()
    class Meta:
        model = Prescriptions
        fields = [
            'id',
            'prescription_date',
            'dose_str',
            'dose',
            'diagnosis',
            'compliance'
        ]
    
    def get_diagnosis(self, obj):
        diagnoses = obj.diagnosis.all()
        if diagnoses:
            diagnoses = [diagnosis.diagnosis.diagnosis for diagnosis in diagnoses]
        else: 
            diagnoses = []
        return diagnoses

    def get_compliance(self, obj):
        compliance = obj.compliance.all()
        if compliance:
            compliance = [c.use.use for c in compliance]
        else:
            compliance = []
            
        return compliance