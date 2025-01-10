/*
SQL statements to define the db schema
annonated with brief SQL comments

will likely contain CREATE TABLE, CREATE INDEX, CREATE VIEW
*/
-- list of  countries
CREATE TABLE `countries` (
    `id` SMALLINT UNSIGNED NOT NULL UNIQUE,
    `name` VARCHAR(64) NOT NULL,
    PRIMARY KEY(`id`)
);

-- list of cities
CREATE TABLE `cities` (
    `id` INT UNSIGNED NOT NULL UNIQUE,
    `name` VARCHAR(64) NOT NULL,
    `country_id` SMALLINT UNSIGNED NOT NULL,
    `latitude` FLOAT NOT NULL,
    `longitude` FLOAT NOT NULL,
    FOREIGN KEY(`country_id`) REFERENCES `countries`(`id`),
    PRIMARY KEY(`id`)
);