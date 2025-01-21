DROP TABLE IF EXISTS `allergies`;
DROP TABLE IF EXISTS `prescription_diagnosis`;
DROP TABLE IF EXISTS `prescriptions`;
DROP TABLE IF EXISTS `abbreviations`;
DROP TABLE IF EXISTS `dosage`;
DROP TABLE IF EXISTS `synonyms`;
DROP TABLE IF EXISTS `antibiotics`;
DROP TABLE IF EXISTS `antibiotic_groups`;
 /*
did not create a constraint for synonyms and abbreviation, resulting in duplicate rows
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
 */