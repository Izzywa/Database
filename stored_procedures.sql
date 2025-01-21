DELIMITER //

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

DROP PROCEDURE IF EXISTS `allergy_trade_name_by_pt_id`//
CREATE PROCEDURE `allergy_trade_name_by_pt_id` (IN `pt_id` INT)
BEGIN
    SELECT `synonyms`.`synonym` AS `trade_name`
    FROM `allergies`
    JOIN `synonyms` ON `allergies`.`ab` = `synonyms`.`ab`
    WHERE `allergies`.`patient_id` = `pt_id`;
END//

DROP PROCEDURE IF EXISTS `allergy_official_name_by_pt_id`//
CREATE PROCEDURE `allergy_official_name_by_pt_id` (IN `pt_id` INT)
BEGIN
    SELECT `antibiotics`.`name` AS `official_name`
    FROM `allergies`
    JOIN `antibiotics` ON `allergies`.`ab` = `antibiotics`.`ab`
    WHERE `allergies`.`patient_id` = `pt_id`;
END//

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