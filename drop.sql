DROP TABLE compliance;
DROP TABLE prescription_diagnosis;
DROP TABLE diagnoses;
DROP TABLE ab_usage;
DROP TABLE allergies;
DROP TABLE visits;
DROP TABLE prescriptions;
DROP TABLE patients;
DROP TABLE dial_codes;
DROP TABLE countries;
DROP TABLE dosage;
DROP TABLE abbreviations;
DROP TABLE synonyms;
DROP TABLE antibiotics;
DROP TABLE antibiotic_groups;

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
 */