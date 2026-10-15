CREATE TABLE `entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`description` text NOT NULL,
	`cents` integer NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL
);
