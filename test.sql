
/*
create indexes:
    - dosage
    - synonym
    - abbr

create views/ temp view:
active users
undeleted visits and prescription
take argument of patient id: 
    - display visits and prescription, join
    - display prescription, date, compliance, diagnosis
    - display the list of ab pt is confirmed to be allergic to

create prepared statement:

create user permissions:
other user but the admin could not delete,
if they want to delete values in the table , will set the deleted column to 1
type of user:
    - admin
        - all permission
    - healthcare worker
        - could not delete
        - can update
        - could not update anything related to the antibiotic, dosage
    - analyst
        - could only view patient_id
        - can view the patients prescription and diagnosis, but not the visit.
        - but can see the date of the patient visit
        - only select
*/