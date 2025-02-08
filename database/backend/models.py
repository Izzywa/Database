from django.db import models
from django.db.models import Q

class AntibioticGroups(models.Model):
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=40)

    class Meta:
        db_table = 'antibiotic_groups'


class Antibiotics(models.Model):
    ab = models.CharField(primary_key=True, max_length=5)
    cid = models.PositiveIntegerField(blank=True, null=True)
    name = models.CharField(unique=True, max_length=64)
    group = models.ForeignKey(AntibioticGroups, on_delete=models.SET_NULL, related_name="antibiotics", blank=True, null=True)

    class Meta:
        db_table = 'antibiotics'
        
    def serialize(self):
        return({
            'ab': self.ab,
            'name': self.name
        })
        
        
class Abbreviations(models.Model):
    id = models.SmallAutoField(primary_key=True)
    ab = models.ForeignKey(Antibiotics, on_delete=models.CASCADE, related_name="abbreviations", db_column='ab')
    abbreviation = models.CharField(max_length=32)

    class Meta:
        db_table = 'abbreviations'
        unique_together = (('ab', 'abbreviation'),)
        
        
class Synonyms(models.Model):
    id = models.SmallAutoField(primary_key=True)
    ab = models.ForeignKey(Antibiotics, on_delete=models.CASCADE, related_name="synonyms", db_column='ab')
    synonym = models.CharField(max_length=32)

    class Meta:
        db_table = 'synonyms'
        unique_together = (('ab', 'synonym'),)
        
    def serialize(self):
        return({
            'ab': self.ab.ab,
            'name': self.synonym
        })
        
class Dosage(models.Model):
    ab = models.ForeignKey(Antibiotics,on_delete=models.CASCADE, related_name="dosage", db_column='ab')
    type = models.CharField(max_length=17, blank=True, null=True)
    dose = models.CharField(max_length=20)
    dose_times = models.PositiveIntegerField(blank=True, null=True)
    administration = models.CharField(max_length=4, blank=True, null=True)

    class Meta:
        db_table = 'dosage'
        unique_together = (('ab', 'type', 'dose', 'dose_times', 'administration'),)
        

class AbUsage(models.Model):
    id = models.SmallAutoField(primary_key=True)
    use = models.CharField(unique=True, max_length=64)

    class Meta:
        db_table = 'ab_usage'
        
class Diagnoses(models.Model):
    id = models.SmallAutoField(primary_key=True)
    diagnosis = models.CharField(unique=True, max_length=64)

    class Meta:
        db_table = 'diagnoses'
        
    def __str__(self):
        return self.diagnosis
        

class Countries(models.Model):
    code = models.CharField(primary_key=True, max_length=3)
    name = models.CharField(max_length=64)

    class Meta:
        db_table = 'countries'
        
    def __str__(self):
        return self.name
        
class DialCodes(models.Model):
    id = models.SmallAutoField(primary_key=True)
    dial = models.PositiveSmallIntegerField()
    country_code = models.ForeignKey(Countries, on_delete=models.CASCADE, related_name="dial_codes", db_column='country_code')

    class Meta:
        db_table = 'dial_codes'
        unique_together = (('dial', 'country_code'),)
    
        
class Patients(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True, blank=True, null=True)
    dial_code = models.ForeignKey(DialCodes, on_delete=models.SET_NULL, related_name="dial_code", blank=True, null=True)
    phone = models.IntegerField(blank=True, null=True)
    birth_date = models.DateField()
    resident_country_code = models.ForeignKey(Countries, on_delete=models.PROTECT, db_column='resident_country_code', related_name='resident_country')
    birth_country_code = models.ForeignKey(Countries, on_delete=models.PROTECT, db_column='birth_country_code', related_name='birth_country')
    deleted = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'patients'
    
        constraints = [
            models.CheckConstraint(
                check=Q(dial_code__isnull=False, phone__isnull=False) | Q(dial_code__isnull=True, phone__isnull=True),
                name="Phone and dial code must both be either empty or filled"
            )
            ] 
            
    def birth_country(self):
        return self.birth_country_code.name
    
    def resident_country(self):
        return self.resident_country_code.name
    
    def phone_number(self):
        if self.phone != None:
            return "+" + str(self.dial_code.dial) + str(self.phone)


class Allergies(models.Model):
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE, related_name="allergies")
    ab = models.ForeignKey(Antibiotics, on_delete=models.CASCADE, db_column='ab')

    class Meta:
        db_table = 'allergies'
        unique_together = (('ab', 'patient'),)
        
class Visits(models.Model):
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE, related_name="visits")
    visit_date = models.DateField()
    last_modified = models.DateTimeField(blank=True, null=True)
    note = models.CharField(max_length=5000, blank=True, null=True)
    deleted = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'visits'
        
class Prescriptions(models.Model):
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE, related_name="prescriptions")
    dose = models.ForeignKey(Dosage, on_delete=models.SET_NULL, blank=True, null=True)
    prescription_date = models.DateField()
    last_modified = models.DateTimeField(blank=True, null=True)
    deleted = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = 'prescriptions'
    
    def dose_str(self):
        ab = self.dose.ab.name
        dose = self.dose.dose
        dose_times = self.dose.dose_times
        administration = self.dose.administration
        return f"{ab} {dose} x {dose_times}, {administration}"


class PrescriptionDiagnosis(models.Model):
    diagnosis = models.ForeignKey(Diagnoses, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescriptions, related_name="diagnosis", on_delete=models.CASCADE)

    class Meta:
        db_table = 'prescription_diagnosis'
        unique_together = (('diagnosis', 'prescription'),)
        
    def get_diagnosis(self):
        return self.diagnosis
        
class Compliance(models.Model):
    prescription = models.ForeignKey(Prescriptions, related_name="compliance", on_delete=models.CASCADE)
    use = models.ForeignKey(AbUsage, on_delete=models.CASCADE)

    class Meta:
        db_table = 'compliance'
        unique_together = (('prescription', 'use'),)
        
    def get_use(self):
        return self.use.use
