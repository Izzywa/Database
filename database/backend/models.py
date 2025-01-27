# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class AntibioticGroups(models.Model):
    id = models.SmallAutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=40)

    class Meta:
        db_table = 'antibiotic_groups'


class Antibiotics(models.Model):
    ab = models.CharField(primary_key=True, max_length=5)
    cid = models.PositiveIntegerField(blank=True, null=True)
    name = models.CharField(unique=True, max_length=64)
    group = models.ForeignKey(AntibioticGroups, on_delete=models.SET_NULL, blank=True, null=True)

    class Meta:
        db_table = 'antibiotics'
        
        
class Abbreviations(models.Model):
    id = models.SmallAutoField(primary_key=True)
    ab = models.ForeignKey(Antibiotics, on_delete=models.CASCADE, db_column='ab')
    abbreviation = models.CharField(max_length=32)

    class Meta:
        db_table = 'abbreviations'
        unique_together = (('ab', 'abbreviation'),)
        
        
class Synonyms(models.Model):
    id = models.SmallAutoField(primary_key=True)
    ab = models.ForeignKey(Antibiotics, on_delete=models.CASCADE, db_column='ab')
    synonym = models.CharField(max_length=32)

    class Meta:
        db_table = 'synonyms'
        unique_together = (('ab', 'synonym'),)
        
        
class Dosage(models.Model):
    ab = models.ForeignKey(Antibiotics,on_delete=models.CASCADE, db_column='ab')
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
        

class Countries(models.Model):
    code = models.CharField(primary_key=True, max_length=3)
    name = models.CharField(max_length=64)

    class Meta:
        db_table = 'countries'
        
class DialCodes(models.Model):
    id = models.SmallAutoField(primary_key=True)
    dial = models.PositiveSmallIntegerField()
    country_code = models.ForeignKey(Countries, on_delete=models.CASCADE, db_column='country_code')

    class Meta:
        db_table = 'dial_codes'
        unique_together = (('dial', 'country_code'),)
        
class Patients(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.CharField(max_length=100, blank=True, null=True)
    dial_code = models.ForeignKey(DialCodes, on_delete=models.SET_NULL, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    birth_date = models.DateField()
    resident_country_code = models.ForeignKey(Countries, on_delete=models.PROTECT, db_column='resident_country_code')
    birth_country_code = models.ForeignKey(Countries, on_delete=models.PROTECT, db_column='birth_country_code', related_name='patients_birth_country_code_set')
    deleted = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'patients'


class Allergies(models.Model):
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    ab = models.ForeignKey(Antibiotics, on_delete=models.CASCADE, db_column='ab')

    class Meta:
        db_table = 'allergies'
        unique_together = (('ab', 'patient'),)
        
class Visits(models.Model):
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    visit_date = models.DateField()
    last_modified = models.DateTimeField(blank=True, null=True)
    note = models.CharField(max_length=5000, blank=True, null=True)
    deleted = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'visits'
        
class Prescriptions(models.Model):
    patient = models.ForeignKey(Patients, on_delete=models.CASCADE)
    dose = models.ForeignKey(Dosage, on_delete=models.SET_NULL, blank=True, null=True)
    prescription_date = models.DateField()
    last_modified = models.DateTimeField(blank=True, null=True)
    deleted = models.PositiveIntegerField(blank=True, null=True)

    class Meta:
        db_table = 'prescriptions'


class PrescriptionDiagnosis(models.Model):
    diagnosis = models.ForeignKey(Diagnoses, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescriptions, on_delete=models.CASCADE)

    class Meta:
        db_table = 'prescription_diagnosis'
        unique_together = (('diagnosis', 'prescription'),)
        
class Compliance(models.Model):
    prescription = models.ForeignKey(Prescriptions, on_delete=models.CASCADE)
    use = models.ForeignKey(AbUsage, on_delete=models.CASCADE)

    class Meta:
        db_table = 'compliance'
        unique_together = (('prescription', 'use'),)
