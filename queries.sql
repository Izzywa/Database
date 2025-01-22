-- Search patients information by full name
SELECT * FROM `current_patients`
WHERE `full_name` LIKE 'someone';

/*
Get the name of the antibiotics a patient is allergic to.
This could either be the official antibiotic name, or its synonymous/ trade name
*/
CALL `allergy_official_name_by_pt_id`(1);
CALL `allergy_trade_name_by_pt_id`(1);

-- Get the information on the visits and prescription of the patient, grouped by dates
CALL `visit_prescription_by_pt_id`(1);

-- Get the information on a patient's compliance on the prescibed antibiotics
CALL `diagnosis_compliance_by_pt_id`(1);

-- Search for an antibiotic and get back the official name and code 
CALL `search_ab`('flagyl');

-- Mark a patient's information as deleted
UPDATE `patients` 
SET `deleted` = 1
WHERE `id` = 2;

-- Create a visit for a patient
INSERT INTO `visits` (
    `patient_id`,
    `visit_date`,
    `note`
)
VALUES (
    2,
    (CURRENT_DATE()),
    "example note for a patient's visit"
);