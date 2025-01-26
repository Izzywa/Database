DELIMITER |
DROP TRIGGER IF EXISTS `lowercase_diagnoses_insert`|
CREATE TRIGGER `lowercase_diagnoses_insert`
BEFORE INSERT ON `diagnoses`
    FOR EACH ROW
        SET NEW.diagnosis = LOWER(NEW.diagnosis)|

DROP TRIGGER IF EXISTS `lowercase_diagnoses_update`|
CREATE TRIGGER `lowercase_diagnoses_update`
BEFORE UPDATE ON `ab_usage`
    FOR EACH ROW
        SET NEW.use = LOWER(NEW.use)|

DROP TRIGGER IF EXISTS `lowercase_usage_insert`|
CREATE TRIGGER `lowercase_usage_insert`
BEFORE UPDATE ON `ab_usage`
    FOR EACH ROW
        SET NEW.use = LOWER(NEW.use)|

DROP TRIGGER IF EXISTS `lowercase_usage_update`|
CREATE TRIGGER `lowercase_usage_update`
BEFORE UPDATE ON `diagnoses`
    FOR EACH ROW
        SET NEW.diagnosis = LOWER(NEW.diagnosis)|

DELIMITER ;