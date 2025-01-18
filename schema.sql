-- List of countries and their unique ISO3166-1-Alpha-3 codes which must be in uppercase
CREATE TABLE IF NOT EXISTS `countries` (
    `code` CHAR(3) UNIQUE NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`code`),
    CONSTRAINT `force_upper_case` CHECK(BINARY `code` = UPPER(`code`)),
    
);

CREATE TABLE IF NOT EXISTS `dial_codes` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `dial` SMALLINT UNSIGNED NOT NULL,
    `country_code` CHAR(3) NOT NULL,
    FOREIGN KEY(`country_code`) REFERENCES `countries`(`code`) ON DELETE CASCADE,
    PRIMARY KEY(`id`),
    UNIQUE `unique_together` (`dial`, `country_code`)
);

CREATE TABLE IF NOT EXISTS `antibiotic_groups` (
    `id` TINYINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL UNIQUE,
    PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS `antibiotics` (
    `ab` VARCHAR(5) NOT NULL UNIQUE,
    `cid` INT UNSIGNED,
    `name` VARCHAR(64) UNIQUE NOT NULL,
    `group_id` TINYINT UNSIGNED,
    FOREIGN KEY(`group_id`) REFERENCES `antibiotic_groups`(`id`) ON DELETE SET NULL,
    PRIMARY KEY(`ab`)
);


CREATE TABLE IF NOT EXISTS `abbreviations` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `ab` VARCHAR(5) NOT NULL,
    `abbreviation` VARCHAR(32) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)
);

 CREATE TABLE IF NOT EXISTS `synonyms` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `ab` VARCHAR(5) NOT NULL,
    `synonym` VARCHAR(32) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)
 );

  CREATE TABLE IF NOT EXISTS `dosage` (
    `id` MEDIUMINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `ab` VARCHAR(5) NOT NULL,
    `type` ENUM('standard_dosage','high_dosage','uncomplicated_uti'),
    `dose` VARCHAR(20) NOT NULL,
    `dose_times` TINYINT UNSIGNED,
    `administration` ENUM('iv','oral','im'),
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)
 );

 CREATE TABLE IF NOT EXISTS `patients` (
    `id` INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100),
    `dial_code_id` SMALLINT UNSIGNED,
    `phone` VARCHAR(15),
    `birth_date` DATE NOT NULL,
    `resident_country_code` CHAR(3) NOT NULL,
    `birth_country_code` CHAR(3) NOT NULL,
    `deleted` TINYINT UNSIGNED CHECK(`deleted` = 1 OR `deleted` = 0) DEFAULT 0,
    FOREIGN KEY(`resident_country_code`) REFERENCES `countries`(`code`),
    FOREIGN KEY(`birth_country_code`) REFERENCES `countries`(`code`),
    CONSTRAINT `digits_only_phone`CHECK(`phone` IS NULL OR `phone` regexp '^[0-9]+$'),
    FOREIGN KEY(`dial_code_id`) REFERENCES `dial_codes`(`id`),
    PRIMARY KEY(`id`),
    CONSTRAINT `phone_dial_constraint` CHECK (
        (`phone` IS NULL AND `dial_code_id` IS NULL)
        OR (`phone` IS NOT NULL AND `dial_code_id` IS NOT NULL)
        )
);

CREATE TABLE IF NOT EXISTS `allergies` (
    `id` INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `patient_id` INT UNSIGNED NOT NULL,
    `ab` CHAR(5) NOT NULL,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`),
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`),
    PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `visits` (
    `id` INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `patient_id` INT UNSIGNED NOT NULL,
    `visit_date` DATE NOT NULL,
    `updated_timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `note` VARCHAR(5000),
    `deleted` TINYINT UNSIGNED CHECK(`deleted` = 1 OR `deleted` = 0) DEFAULT 0,
    FOREIGN KEY(`patient_id`) REFERENCES `patients`(`id`),
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `diagnoses` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `diagnosis` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `prescriptions` (
    `id` INT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `patient_id` INT UNSIGNED NOT NULL,
    `dose_id` MEDIUMINT UNSIGNED,
    `prescription_date` DATE NOT NULL,
    `last_modified` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted` TINYINT UNSIGNED CHECK(`deleted` = 1 OR `deleted` = 0) DEFAULT 0,
    FOREIGN KEY (`patient_id`) REFERENCES `patients`(`id`),
    FOREIGN KEY (`dose_id`) REFERENCES `dosage`(`id`),
    PRIMARY KEY(`id`),
    CONSTRAINT `check_date` CHECK(`prescription_date` <= `last_modified`)
);