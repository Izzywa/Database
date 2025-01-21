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

SELECT `visit`.`date`,
`prescription`.`date`,
GROUP_CONCAT(DISTINCT `visit`.`note`) AS `note`,
GROUP_CONCAT(DISTINCT `prescription`.`dose`) AS `dose`
FROM
(
    SELECT `v`.`visit_date` AS `date`,
    `v`.`note` AS `note`
    FROM `patients` AS `p`
    CROSS JOIN `visits` AS `v` ON `p`.`id` = `v`.`patient_id`
    WHERE `p`.`id` = 1
) AS `visit`
LEFT JOIN (
    SELECT `pr`.`prescription_date` AS `date`,
    `pr`.`dose_id` AS `dose`
    FROM `patients` AS `p`
    CROSS JOIN `prescriptions` AS `pr` ON `p`.`id` = `pr`.`patient_id`
    WHERE `p`.`id` = 1
) AS `prescription`
ON `visit`.`date` = `prescription`.`date`
GROUP BY `visit`.`date`, `prescription`.`date`
UNION
SELECT `visit`.`date`,
`prescription`.`date`,
GROUP_CONCAT(DISTINCT `visit`.`note`) AS `note`,
GROUP_CONCAT(DISTINCT `prescription`.`dose`) AS `dose`
FROM
(
    SELECT `v`.`visit_date` AS `date`,
    `v`.`note` AS `note`
    FROM `patients` AS `p`
    CROSS JOIN `visits` AS `v` ON `p`.`id` = `v`.`patient_id`
    WHERE `p`.`id` = 1
) AS `visit`
RIGHT JOIN (
    SELECT `pr`.`prescription_date` AS `date`,
    `pr`.`dose_id` AS `dose`
    FROM `patients` AS `p`
    CROSS JOIN `prescriptions` AS `pr` ON `p`.`id` = `pr`.`patient_id`
    WHERE `p`.`id` = 1
) AS `prescription`
ON `visit`.`date` = `prescription`.`date`
GROUP BY `visit`.`date`, `prescription`.`date`