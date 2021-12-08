CREATE TABLE `mycrawl`.`user_action` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `request_time` VARCHAR(45) NOT NULL,
  `request_method` VARCHAR(20) NOT NULL,
  `request_url` VARCHAR(300) NOT NULL,
  `status` int(4),
  `remote_addr` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`))
ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `mycrawl`.`user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `registertime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`))
ENGINE=InnoDB DEFAULT CHARSET=utf8;