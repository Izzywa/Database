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

create prepared statement:

create user permissions:
other user but the admin could not delete,
if they want to delete values in the table , will set the deleted column to 1
type of user:
    - admin
        - all permission
    - healthcare worker
    - researcher
        - could only view patient_id
*/