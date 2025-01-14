CREATE TABLE `test` (
    `phone` VARCHAR(15),
    CONSTRAINT `digits_only` CHECK(`phone` is NULL or `phone` regexp '^[0-9]+$')
)