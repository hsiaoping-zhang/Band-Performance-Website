USE TEST_BAND_DB;
CREATE TABLE IF NOT EXISTS
    `PerformerActivity` (
        `performer_id` int NOT NULL,
        `activity_id` int NOT NULL,
        PRIMARY KEY (`performer_id`, `activity_id`),
        KEY `activity_id` (`activity_id`),
        CONSTRAINT `performeractivity_ibfk_1` FOREIGN KEY (`performer_id`) REFERENCES `Performer` (`id`),
        CONSTRAINT `performeractivity_ibfk_2` FOREIGN KEY (`activity_id`) REFERENCES `activity` (`id`)
    );