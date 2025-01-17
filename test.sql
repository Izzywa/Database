DROP TABLE IF EXISTS `abbreviations`;
DROP TABLE IF EXISTS `synonyms`;
DROP TABLE IF EXISTS `antibiotics`;
DROP TABLE IF EXISTS `microorganisms`;
DROP TABLE IF EXISTS `intrinsic_resistance`;
DROP TABLE IF EXISTS `antibiotic_groups`;

CREATE TABLE `antibiotic_groups` (
    `id` TINYINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `name` VARCHAR(40) NOT NULL UNIQUE,
    PRIMARY KEY(`id`)
);


CREATE TABLE `antibiotics` (
    `ab` VARCHAR(5) NOT NULL UNIQUE,
    `cid` INT UNSIGNED,
    `name` VARCHAR(64) UNIQUE NOT NULL,
    `group_id` TINYINT UNSIGNED,
    FOREIGN KEY(`group_id`) REFERENCES `antibiotic_groups`(`id`) ON DELETE SET NULL,
    PRIMARY KEY(`ab`)
);


CREATE TABLE `abbreviations` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `ab` VARCHAR(5) NOT NULL,
    `abbreviation` VARCHAR(32) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)
);

 CREATE TABLE `synonyms` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE AUTO_INCREMENT,
    `ab` VARCHAR(5) NOT NULL,
    `synonym` VARCHAR(32) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    PRIMARY KEY(`id`)
 );

 CREATE TABLE `microorganisms` (
    `mo` VARCHAR(16) NOT NULL UNIQUE,
    `fullname` VARCHAR(32) NOT NULL UNIQUE,
    `kingdom` ENUM('Bacteria', 'Fungi', '(unknown kingdom)', 'Protozoa', 'Archaea', 'Animalia', 'Chromista'),
    `oxygen_tolerance` ENUM('facultative anaerobe', 'likely facultative anaerobe', 'anaerobe', 'aerobe', 'microaerophile', 'anaerobe/microaerophile'),
    PRIMARY KEY(`mo`)
 );

 CREATE TABLE `intrinsic_resistance` (
    `mo` VARCHAR(16) NOT NULL UNIQUE,
    `ab` VARCHAR(5) NOT NULL,
    FOREIGN KEY (`ab`) REFERENCES `antibiotics`(`ab`) ON DELETE CASCADE,
    FOREIGN KEY (`mo`) REFERENCES `microorganisms`(`mo`) ON DELETE CASCADE,
    PRIMARY KEY(`mo`, `ab`)
 );