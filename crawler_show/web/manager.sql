CREATE TABLE `mycrawl`.`manager` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `managername` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `registertime` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`managername`))
ENGINE=InnoDB DEFAULT CHARSET=utf8;