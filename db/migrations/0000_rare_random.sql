CREATE TABLE `about_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`section` varchar(100) NOT NULL,
	`title` varchar(255),
	`content` text,
	`image_url` varchar(255),
	CONSTRAINT `about_content_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brands` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	CONSTRAINT `brands_id` PRIMARY KEY(`id`),
	CONSTRAINT `brands_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `carousel_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255),
	`subtitle` varchar(255),
	`image_url` varchar(255) NOT NULL,
	`order` int NOT NULL,
	`active` boolean DEFAULT true,
	CONSTRAINT `carousel_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `company_values` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`icon` varchar(100),
	`order` int DEFAULT 0,
	CONSTRAINT `company_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` varchar(50) NOT NULL,
	`value` text NOT NULL,
	`icon` varchar(100),
	`order` int DEFAULT 0,
	CONSTRAINT `contact_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faq_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` varchar(255) NOT NULL,
	`answer` text NOT NULL,
	`category` varchar(100),
	`order` int DEFAULT 0,
	CONSTRAINT `faq_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` varchar(10) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`order` int DEFAULT 0,
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_to_category` (
	`product_id` int NOT NULL,
	`category_id` int NOT NULL,
	CONSTRAINT `product_to_category_product_id_category_id_pk` PRIMARY KEY(`product_id`,`category_id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`description` text,
	`image` varchar(255) NOT NULL,
	`category` varchar(100),
	`brand` varchar(100),
	`is_new` boolean DEFAULT false,
	`is_bestseller` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`position` varchar(255) NOT NULL,
	`bio` text,
	`image_url` varchar(255),
	`order` int DEFAULT 0,
	CONSTRAINT `team_members_id` PRIMARY KEY(`id`)
);
