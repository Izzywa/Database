-- List of countries and their unique ISO3166-1-Alpha-3 codes which must be in uppercase
CREATE TABLE `countries` (
    `code` CHAR(3) UNIQUE NOT NULL,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY (`code`),
    CONSTRAINT `force_upper_case` CHECK(BINARY `code` = UPPER(`code`)),
    
);

CREATE TABLE `dial_codes` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `dial` SMALLINT UNSIGNED NOT NULL,
    `country_code` CHAR(3) NOT NULL,
    FOREIGN KEY(`country_code`) REFERENCES `countries`(`code`) ON DELETE CASCADE,
    PRIMARY KEY(`id`),
    UNIQUE `unique_together` (`dial`, `country_code`)
);

DROP TABLE IF EXISTS `antibiotic_groups`;
CREATE TABLE `antibiotic_groups` (
    `id` TINYINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `name` VARCHAR(32) NOT NULL UNIQUE,
    PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `antibiotics`;
CREATE TABLE `antibiotics` (
    `ab` CHAR(3) NOT NULL UNIQUE,
    `cid` INT UNSIGNED UNIQUE,
    `name` VARCHAR(64) UNIQUE NOT NULL,
    `group_id` TINYINT UNSIGNED,
    FOREIGN KEY(`group_id`) REFERENCES `antibiotic_groups`(`id`) ON DELETE SET NULL,
    PRIMARY KEY(`ab`)
);

DROP TABLE IF EXISTS `abbreviations`;
CREATE TABLE `abbreviations` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `ab` CHAR(3) NOT NULL,
    `abbreviation` VARCHAR(32) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)
);

DROP TABLE IF EXISTS `synonyms`;
 CREATE TABLE `synonyms` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `ab` CHAR(3) NOT NULL,
    `synonym` VARCHAR(32) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)
 );

 DROP TABLE IF EXISTS `microorganisms`;
 CREATE TABLE `microorganisms` (
    `mo` VARCHAR(16) NOT NULL UNIQUE,
    `fullname` VARCHAR(32) NOT NULL UNIQUE,
    `kingdom` ENUM('Bacteria', 'Fungi', '(unknown kingdom)', 'Protozoa', 'Archaea', 'Animalia', 'Chromista'),
    `oxygen_tolerance` ENUM('facultative anaerobe', 'likely facultative anaerobe', 'anaerobe', 'aerobe', 'microaerophile', 'anaerobe/microaerophile'),
    PRIMARY KEY(`mo`)
 );

 DROP TABLE IF EXISTS `intrinsic_resistance`;
 CREATE TABLE `intrinsic_resistance` (
    `mo` VARCHAR(16) NOT NULL UNIQUE,
    `ab` CHAR(3) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    FOREIGN KEY (`mo`) REFERENCES `microorganisms`(`mo`) ON DELETE CASCADE,
    PRIMARY KEY(`mo`, `ab`)
 );