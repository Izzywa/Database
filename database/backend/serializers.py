from datetime import date
from dateutil.relativedelta import relativedelta
from rest_framework import serializers
from .models import Patients, Countries, DialCodes, Prescriptions, Visits, Antibiotics, Diagnoses, AbUsage, Dosage
        
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
            'deleted'
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
            'compliance',
            'deleted'
        ]
    
    def get_diagnosis(self, obj):
        diagnoses = obj.diagnosis.all()
        if diagnoses:
            diagnoses = [diagnosis.diagnosis.diagnosis.capitalize() for diagnosis in diagnoses]
        else: 
            diagnoses = []
        return diagnoses

    def get_compliance(self, obj):
        compliance = obj.compliance.all()
        if compliance:
            compliance = [c.use.use.capitalize() for c in compliance]
        else:
            compliance = []
            
        return compliance
    
class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visits
        fields = '__all__'
        
class VisitPrescriptionSerializer(serializers.ModelSerializer):
    dates = serializers.SerializerMethodField()
    staff = serializers.SerializerMethodField()
    class Meta:
        model = Patients
        fields = [
            'id',
            'dates',
            'staff'
        ]
        
    def get_staff(self, obj):
        is_staff = self.context.get('is_staff')
        return is_staff
        
    def get_dates(self, obj):
        date_list = self.context.get('dates')
        is_staff = self.context.get('is_staff')
        vp_list = []
        for date in date_list:
            date_str = date.strftime('%Y-%m-%d')
            
            if is_staff:
                visits = obj.visits.filter(visit_date=date)
                prescriptions = obj.prescriptions.filter(prescription_date=date)
            else:
                visits = obj.visits.filter(visit_date=date, deleted=0)
                prescriptions = obj.prescriptions.filter(prescription_date=date, deleted=0)    
            
            visits_data = VisitSerializer(visits, many=True).data
            prescriptions_data = PrescriptionSerializer(prescriptions, many=True).data
            
            new_dict = {
                'date': date_str,
                'visits': visits_data,
                'prescription': prescriptions_data
            }
            vp_list.append(new_dict)
            
        return vp_list
    
class PatientPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patients
        fields = '__all__'
        
    def validate(self, obj):
        try:
            dial = obj['dial_code']
        except KeyError:
            dial = None
            
        try:
            phone = obj['phone']
        except KeyError:
            phone = None
            
        if (dial == None and phone != None) or (dial != None and phone == None):
            raise serializers.ValidationError('Phone and Dial code must both be empty or filled')
        
        return obj
    
    def validate_birth_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Birth date must not be in the future")
        return value

class AntibioticSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    
    class Meta:
        model = Antibiotics
        fields = [
            'label',
            'value'
        ]
    
    def get_label(self, obj):
        return obj.name
        
    def get_value(self, obj):
        return obj.ab

class SynonymsSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    
    class Meta:
        model = Antibiotics
        fields = [
            'label',
            'value'
        ]
    
    def get_label(self, obj):
        return obj.synonym
        
    def get_value(self, obj):
        return obj.ab.ab
    
class DiagnosesSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    class Meta:
        model = Diagnoses
        fields = [
            'label',
            'value'
        ]
        
    def get_label(self, obj):
        return obj.diagnosis.capitalize()
    
    def get_value(self, obj):
        return obj.id
    
class AbUsageSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    class Meta:
        model = AbUsage
        fields = [
            'label',
            'value'
        ]
        
    def get_label(self, obj):
        return obj.use.capitalize()
    
    def get_value(self, obj):
        return obj.id
    
class DosageSerializer(serializers.ModelSerializer):
    label = serializers.SerializerMethodField()
    value = serializers.SerializerMethodField()
    class Meta:
        model = AbUsage
        fields = [
            'label',
            'value'
        ]
        
    def get_label(self, obj):
        type = " ".join(obj.type.split('_'))
        return f"{type.capitalize()}: {obj.dose} X {obj.dose_times} , {obj.administration}"
    
    def get_value(self, obj):
        return obj.id