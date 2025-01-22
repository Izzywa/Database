DROP TABLE IF EXISTS `allergies`;
DROP TABLE IF EXISTS `prescription_diagnosis`;
DROP TABLE IF EXISTS `prescriptions`;
DROP TABLE IF EXISTS `abbreviations`;
DROP TABLE IF EXISTS `dosage`;
DROP TABLE IF EXISTS `synonyms`;
DROP TABLE IF EXISTS `antibiotics`;
DROP TABLE IF EXISTS `antibiotic_groups`;
 /*
Originally did not create a constraint for synonyms and abbreviation, resulting in duplicate rows
the following query delete the duplicates in the synonym table,
the same could be applied to the abbreviation table

DELETE FROM `synonyms`
WHERE `id` IN (
    SELECT * FROM (
        SELECT MAX(`id`) as `id`
        FROM `synonyms`
        GROUP BY `ab`, `synonym`
        HAVING COUNT(`ab`) > 1
        AND COUNT(`synonym`) > 1
    ) AS `duplicate`
)

CREATE VIEW `current_patients` AS
SELECT 
`p`.`id` AS `id`, 
`p`.`full_name` AS `full_name`,
`p`.`email` AS `email`,
CONCAT('+',`d`.`dial`, ' ', `p`.`phone`) AS `phone`,
`p`.`birth_date` AS `birth_date`,
`c1`.`name` AS `resident_country`,
`c2`.`name` AS `birth_country`
FROM `patients` AS `p`
LEFT JOIN `countries` AS `c1` ON `p`.`resident_country_code` = `c1`.`code`
LEFT JOIN `countries` AS `c2` ON `p`.`birth_country_code` = `c2`.`code`
LEFT JOIN `dial_codes` AS `d` ON `d`.`id` = `p`.`dial_code_id`
WHERE `p`.`deleted` = 0

SELECT `p`.`id` AS `pt_id`,
`v`.`visit_date` AS `visit_date`,
`v`.`note` AS `note`
FROM `visits` AS `v`
JOIN `patients` AS `p` ON `v`.`patient_id` = `p`.`id`
WHERE `v`.`deleted` = 0

SELECT `pr`.`patient_id` AS `pt_id`,
`pr`.`prescription_date` AS `prescription_date`,
CONCAT(`ab`.`name`, ' ', `d`.`dose`,' * ',`d`.`dose_times`, ' ', `d`.`administration`) AS `prescription`
FROM `prescriptions` AS `pr`
LEFT JOIN `dosage` AS `d` ON `pr`.`dose_id` = `d`.`id`
JOIN `antibiotics` AS `ab` ON `d`.`ab` = `ab`.`ab`
WHERE `pr`.`deleted` = 0
 */