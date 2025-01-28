from datetime import date
from dateutil.relativedelta import relativedelta
from rest_framework import serializers
from .models import Patients
        
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