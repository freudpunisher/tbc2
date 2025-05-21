CREATE TABLE `publicite_videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`video_path` varchar(255) NOT NULL,
	`thumbnail_path` varchar(255),
	`type` varchar(50) NOT NULL DEFAULT 'promotional',
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `publicite_videos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `shop_staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`shop_id` int,
	`name` varchar(255) NOT NULL,
	`position` varchar(255) NOT NULL,
	`image_path` varchar(255),
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shop_staff_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `shop_staff` ADD CONSTRAINT `shop_staff_shop_id_shops_id_fk` FOREIGN KEY (`shop_id`) REFERENCES `shops`(`id`) ON DELETE cascade ON UPDATE no action;