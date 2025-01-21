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

SELECT `pr`.`prescription_date` AS `prescription_date`,
`ab`.`name` AS `antibiotic`,
GROUP_CONCAT(DISTINCT `dg`.`diagnosis`) AS `diagnosis`,
GROUP_CONCAT(`au`.`use`) AS `compliance`
FROM `prescriptions` AS `pr`
LEFT JOIN `dosage` AS `d` ON `d`.`id` = `pr`.`dose_id`
LEFT JOIN `prescription_diagnosis` as `pd` ON `pd`.`prescription_id` = `pr`.`id`
LEFT JOIN `diagnoses` AS `dg` ON `dg`.`id` = `pd`.`diagnosis_id`
LEFT JOIN `compliance` AS `c` ON `c`.`prescription_id` = `pr`.`id`
LEFT JOIN `ab_usage` AS `au` ON `au`.`id` = `c`.`use_id`
JOIN `antibiotics` AS `ab` ON `ab`.`ab` = `d`.`ab`
WHERE `pr`.`patient_id` = 1
GROUP BY `pr`.`id`
