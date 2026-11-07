CREATE TABLE `studio_ai_budget` (
	`id` text PRIMARY KEY NOT NULL,
	`used` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `studio_locks` (
	`id` text PRIMARY KEY NOT NULL,
	`expires` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `studio_members` (
	`id` text PRIMARY KEY NOT NULL,
	`workspace` text NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`cases` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `members_workspace` ON `studio_members` (`workspace`);--> statement-breakpoint
CREATE INDEX `members_email` ON `studio_members` (`email`);