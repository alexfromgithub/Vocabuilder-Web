create database vocabuilder;
use vocabuilder;
create table users (`id` INT UNSIGNED NOT NULL AUTO_INCREMENT, `username` VARCHAR(20) NOT NULL, `password` CHAR(60) NOT NULL, `email` VARCHAR(254), `firstname` VARCHAR(255) NOT NULL, `lastname` VARCHAR(255) NOT NULL, PRIMARY KEY (`id`), UNIQUE INDEX `id_UNIQUE` (`id` ASC), UNIQUE INDEX `username_UNIQUE` (`username` ASC));