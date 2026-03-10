CREATE TABLE `ideas` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`slug` text NOT NULL UNIQUE,
	`title` text NOT NULL,
	`category` text NOT NULL,
	`description` text NOT NULL,
	`content` text NOT NULL,
	`tags` text NOT NULL,
	`stage` text NOT NULL,
	`complexity` text NOT NULL,
	`date_added` text NOT NULL,
	`last_updated` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inspiration_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`idea_id` integer NOT NULL,
	`label` text NOT NULL,
	`href` text NOT NULL,
	CONSTRAINT `fk_inspiration_links_idea_id_ideas_id_fk` FOREIGN KEY (`idea_id`) REFERENCES `ideas`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `rabbit_holes` (
	`id` integer PRIMARY KEY AUTOINCREMENT,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`category` text NOT NULL,
	`tags` text NOT NULL,
	`url` text,
	`repo` text,
	`status` text NOT NULL,
	`notes` text
);
