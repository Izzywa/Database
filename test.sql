SELECT * FROM `dosage` 
WHERE `ab` = (
    SELECT `ab` FROM `synonyms` WHERE `synonym` LIKE 'amoxicillin'
) 
ORDER BY `type`, `administration`