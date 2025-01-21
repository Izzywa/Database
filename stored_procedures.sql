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
