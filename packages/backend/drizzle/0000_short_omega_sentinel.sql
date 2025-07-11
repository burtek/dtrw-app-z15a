CREATE TABLE `caretakers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pesel` text NOT NULL,
	`name` text NOT NULL,
	`surname` text NOT NULL,
	`street` text NOT NULL,
	`street_no` text NOT NULL,
	`flat_no` text,
	`zip_code` text NOT NULL,
	`city` text NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`caretaker` integer NOT NULL,
	`name` text NOT NULL,
	`nip` text NOT NULL,
	`form` text,
	`to` text,
	`notes` text,
	FOREIGN KEY (`caretaker`) REFERENCES `caretakers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `kids` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pesel` text NOT NULL,
	`name` text NOT NULL,
	`surname` text NOT NULL,
	`father_id` integer NOT NULL,
	`mother_id` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`father_id`) REFERENCES `caretakers`(`id`) ON UPDATE no action ON DELETE restrict,
	FOREIGN KEY (`mother_id`) REFERENCES `caretakers`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE TABLE `leaves` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`zla` text,
	`job_id` integer NOT NULL,
	`kid_id` integer NOT NULL,
	`date_from` text NOT NULL,
	`date_to` text NOT NULL,
	`days_taken` text NOT NULL,
	`z15a_notes` text,
	`notes` text,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`kid_id`) REFERENCES `kids`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `leaves_zla_unique` ON `leaves` (`zla`);