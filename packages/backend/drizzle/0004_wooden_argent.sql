CREATE TABLE `parental_leaves` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kid_id` integer NOT NULL,
	`caretaker_id` integer NOT NULL,
	`date_from` text NOT NULL,
	`weeks_count` integer NOT NULL,
	`userId` text DEFAULT '--unassigned--' NOT NULL,
	FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`caretaker_id`) REFERENCES `caretakers`(`id`) ON UPDATE no action ON DELETE cascade
);
