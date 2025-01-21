DELIMITER //

/*
The patients, visits, and prescriptions table have a column that allows for soft deletion
the `delete_pt_cascade` TRIGGER functions to alter the deleted column of in all the visits
and prescriptions table where the patient id is the 'deleted' patient.
*/
DROP TRIGGER IF EXISTS `delete_pt_cascade`//
CREATE TRIGGER `delete_pt_cascade`
AFTER UPDATE ON `patients`
    FOR EACH ROW
    BEGIN
        IF NEW.deleted <> OLD.deleted THEN
            UPDATE visits SET deleted = NEW.deleted WHERE patient_id = OLD.id;
            UPDATE prescriptions SET deleted = NEW.deleted WHERE patient_id = OLD.id;
        END IF;
    END//

-- This procedure shows the visits and prescription of the patient grouped by date
DROP PROCEDURE IF EXISTS `visit_prescription_by_pt_id`//
CREATE PROCEDURE `visit_prescription_by_pt_id` (IN `pt_id` INT)
BEGIN
    SELECT `visit`.`date` AS `date`,
    GROUP_CONCAT(DISTINCT `visit`.`note`) AS `note`,
    GROUP_CONCAT(DISTINCT `prescription`.`dose`) AS `prescription`
    FROM
    (
        SELECT `v`.`visit_date` AS `date`,
        `v`.`note` AS `note`
        FROM `patients` AS `p`
        CROSS JOIN `visits` AS `v` ON `p`.`id` = `v`.`patient_id`
        WHERE `p`.`id` = `pt_id`
    ) AS `visit`
    LEFT JOIN (
        SELECT `pr`.`prescription_date` AS `date`,
        CONCAT(`d`.`ab`, ' ' , `d`.`dose`, 'x', `d`.`dose_times`, ' ', `d`.`administration`) AS `dose`
        FROM `patients` AS `p`
        CROSS JOIN `prescriptions` AS `pr` ON `p`.`id` = `pr`.`patient_id`
        JOIN `dosage` AS `d` ON `d`.`id` = `pr`.`dose_id`
        WHERE `p`.`id` = `pt_id`
    ) AS `prescription`
    ON `visit`.`date` = `prescription`.`date`
    GROUP BY `visit`.`date`, `prescription`.`date`
    UNION
    SELECT
    `prescription`.`date` AS `date`,
    GROUP_CONCAT(DISTINCT `visit`.`note`) AS `note`,
    GROUP_CONCAT(DISTINCT `prescription`.`dose`) AS `prescription`
    FROM
    (
        SELECT `v`.`visit_date` AS `date`,
        `v`.`note` AS `note`
        FROM `patients` AS `p`
        CROSS JOIN `visits` AS `v` ON `p`.`id` = `v`.`patient_id`
        WHERE `p`.`id` = `pt_id`
    ) AS `visit`
    RIGHT JOIN (
        SELECT `pr`.`prescription_date` AS `date`,
        CONCAT(`d`.`ab`, ' ' , `d`.`dose` ,'x', `d`.`dose_times`, ' ', `d`.`administration`) AS `dose`
        FROM `patients` AS `p`
        CROSS JOIN `prescriptions` AS `pr` ON `p`.`id` = `pr`.`patient_id`
        JOIN `dosage` AS `d` ON `d`.`id` = `pr`.`dose_id`
        WHERE `p`.`id` = `pt_id`
    ) AS `prescription`
    ON `visit`.`date` = `prescription`.`date`
    GROUP BY `visit`.`date`, `prescription`.`date`
    ORDER BY `date` DESC;
END//

-- This shows all the trade name of the antibiotic that the patient is allergic to
DROP PROCEDURE IF EXISTS `allergy_trade_name_by_pt_id`//
CREATE PROCEDURE `allergy_trade_name_by_pt_id` (IN `pt_id` INT)
BEGIN
    SELECT `synonyms`.`synonym` AS `trade_name`
    FROM `allergies`
    JOIN `synonyms` ON `allergies`.`ab` = `synonyms`.`ab`
    WHERE `allergies`.`patient_id` = `pt_id`;
END//

-- This procedure shows all the official name of the antibiotic that the patient is allergic to
DROP PROCEDURE IF EXISTS `allergy_official_name_by_pt_id`//
CREATE PROCEDURE `allergy_official_name_by_pt_id` (IN `pt_id` INT)
BEGIN
    SELECT `antibiotics`.`name` AS `official_name`
    FROM `allergies`
    JOIN `antibiotics` ON `allergies`.`ab` = `antibiotics`.`ab`
    WHERE `allergies`.`patient_id` = `pt_id`;
END//

/*
This table functions to show if the antibiotics was prescribed accordingly.
The date column will show when it was prescribed, so it can be seen if it was prescribed too frequently.
The diagnosis table will show the diagnosis, if any for why it was prescribed. 
Further evaluation could be done to evaluate if the prescription was appropriate for the diagnosis.
The compliance should be a follow up of the patient and how they had used the antibiotics.
*/
DROP PROCEDURE IF EXISTS `diagnosis_compliance_by_pt_id`//
CREATE PROCEDURE `diagnosis_compliance_by_pt_id` (IN `pt_id` INT)
BEGIN
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
    WHERE `pr`.`patient_id` = `pt_id`
    GROUP BY `pr`.`id`;
END//

DELIMITER ;