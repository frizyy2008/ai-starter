PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_notes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "notes_title_len" CHECK(length("__new_notes"."title") BETWEEN 1 AND 120),
	CONSTRAINT "notes_content_len" CHECK(length("__new_notes"."content") BETWEEN 1 AND 5000)
);
--> statement-breakpoint
INSERT INTO `__new_notes`("id", "user_id", "title", "content", "created_at", "updated_at") SELECT "id", "user_id", "title", "content", "created_at", "updated_at" FROM `notes`;--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
ALTER TABLE `__new_notes` RENAME TO `notes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `notes_user_created_idx` ON `notes` (`user_id`,`created_at`);--> statement-breakpoint
DROP INDEX `app_rate_limits_reset_at_idx`;--> statement-breakpoint
ALTER TABLE `app_rate_limits` ADD `reset_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `app_rate_limits` DROP COLUMN `reset_at_ms`;