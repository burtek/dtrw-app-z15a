ALTER TABLE `caretakers` ADD `userId` text DEFAULT '--unassigned--' NOT NULL;--> statement-breakpoint
UPDATE `caretakers` SET `userId` = 'burtek' WHERE `userId` = '--unassigned--';--> statement-breakpoint
ALTER TABLE `jobs` ADD `userId` text DEFAULT '--unassigned--' NOT NULL;--> statement-breakpoint
UPDATE `jobs` SET `userId` = 'burtek' WHERE `userId` = '--unassigned--';--> statement-breakpoint
ALTER TABLE `kids` ADD `userId` text DEFAULT '--unassigned--' NOT NULL;--> statement-breakpoint
UPDATE `kids` SET `userId` = 'burtek' WHERE `userId` = '--unassigned--';--> statement-breakpoint
ALTER TABLE `leaves` ADD `userId` text DEFAULT '--unassigned--' NOT NULL;--> statement-breakpoint
UPDATE `leaves` SET `userId` = 'burtek' WHERE `userId` = '--unassigned--';
