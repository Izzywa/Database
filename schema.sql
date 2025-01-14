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