CREATE TABLE `studio_records` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`kind` text NOT NULL,
	`parent` text,
	`data` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_owner` ON `studio_records` (`owner`);--> statement-breakpoint
CREATE INDEX `records_parent` ON `studio_records` (`parent`);