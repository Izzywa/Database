from rest_framework import serializers
from .models import Patients, DialCodes
        
class PatientSerializer(serializers.ModelSerializer):
    birth_country_code = serializers.StringRelatedField()
    resident_country_code = serializers.StringRelatedField()
    dial_code = serializers.SlugRelatedField(
        many=False,
        read_only=True,
        slug_field='dial'
     )
    
    class Meta:
        model = Patients
        fields = [
            'id', 
            'full_name', 
            'email',
            'birth_date',
            'dial_code',
            'birth_country_code',
            'resident_country_code'
        ]