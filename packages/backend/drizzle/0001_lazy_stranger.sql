ALTER TABLE `caretakers` ADD `email` text;--> statement-breakpoint
CREATE UNIQUE INDEX `caretakers_pesel_unique` ON `caretakers` (`pesel`);--> statement-breakpoint
CREATE UNIQUE INDEX `kids_pesel_unique` ON `kids` (`pesel`);