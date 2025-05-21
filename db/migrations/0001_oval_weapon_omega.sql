CREATE TABLE `shops` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`long_description` text,
	`images` json DEFAULT ('[]'),
	`hours` varchar(255) NOT NULL,
	`phone` varchar(50) NOT NULL,
	`email` varchar(255) NOT NULL,
	`features` json DEFAULT ('[]'),
	`location` varchar(50) NOT NULL DEFAULT 'local',
	`active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `shops_id` PRIMARY KEY(`id`),
	CONSTRAINT `shops_slug_unique` UNIQUE(`slug`)
);
