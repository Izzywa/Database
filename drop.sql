 /*
Originally did not create a constraint for synonyms and abbreviation, resulting in duplicate rows
the following query delete the duplicates in the synonym table,
the same could be applied to the abbreviation table

DELETE FROM `synonyms`
WHERE `id` IN (
    SELECT * FROM (
        SELECT MAX(`id`) as `id`
        FROM `synonyms`
        GROUP BY `ab`, `synonym`
        HAVING COUNT(`ab`) > 1
        AND COUNT(`synonym`) > 1
    ) AS `duplicate`
)
 */