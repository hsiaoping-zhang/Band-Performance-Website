USE TEST_BAND_DB;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `email` varchar(128) DEFAULT NULL,
  `level` varchar(16) DEFAULT NULL,
  `is_valid` tinyint(1) DEFAULT NULL,
  `permission_id` varchar(32) DEFAULT NULL,
  `last_login_time` datetime DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `activity` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `time` datetime NOT NULL,
  `area` varchar(32) DEFAULT NULL,
  `loc` varchar(64) DEFAULT NULL,
  `is_free` tinyint(1) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `city` varchar(10) DEFAULT NULL,
  `performers` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS
    `Performer` (
        `id` int NOT NULL AUTO_INCREMENT,
        `name` varchar(255) NOT NULL,
        `description` text NOT NULL,
        PRIMARY KEY (`id`),
        UNIQUE KEY `name_UNIQUE` (`name`)
    );