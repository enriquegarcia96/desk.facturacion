-- Your SQL goes here
CREATE TABLE `roles` (
  `id_role` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(45) NOT NULL,
  `state` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `employees` (
  `employee_identity` varchar(13) NOT NULL,
  `role_id` int NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(45) NOT NULL,
  `user_name` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `state` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`employee_identity`),
  UNIQUE KEY `employee_identity_UNIQUE` (`employee_identity`),
  UNIQUE KEY `user_name_UNIQUE` (`user_name`),
  KEY `fk_roleid_idx` (`role_id`),
  CONSTRAINT `fk_roleid` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `menus` (
  `id_menu` int NOT NULL AUTO_INCREMENT,
  `title_menu` varchar(100) NOT NULL,
  `route` varchar(100) NOT NULL,
  `parent_id` int DEFAULT NULL,
  `state` tinyint NOT NULL DEFAULT '1',
  `created_on` timestamp NULL DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_menu`),
  KEY `fk_parentId_idx` (`parent_id`),
  CONSTRAINT `fk_parentId` FOREIGN KEY (`parent_id`) REFERENCES `menus` (`id_menu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;


CREATE TABLE `permissions` (
  `id_permission` int NOT NULL AUTO_INCREMENT,
  `created_on` timestamp NULL DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT NULL,
  `menu_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`id_permission`),
  KEY `fk_menuid_idx` (`menu_id`),
  KEY `fk_roleid_idx` (`role_id`),
  CONSTRAINT `fk_menuid` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`id_menu`),
  CONSTRAINT `fk_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;