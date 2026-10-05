-- Your SQL goes here
CREATE TABLE `categories` (
  `id_category` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `modify_by` varchar(45) NOT NULL DEFAULT 'sys',
  `created_on` timestamp NULL DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

CREATE TABLE `products` (
  `id_product` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `modify_by` varchar(100) NOT NULL,
  `created_on` timestamp NULL DEFAULT NULL,
  `updated_on` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_product`),
  KEY `fk_categoryid_idx` (`category_id`),
  CONSTRAINT `fk_categoryid` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id_category`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;