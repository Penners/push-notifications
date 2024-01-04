CREATE TABLE `subscribers` (
	`id` text PRIMARY KEY NOT NULL,
	`endpoint` text,
	`keys` text
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`subscriber_id` text,
	`topic` text,
	PRIMARY KEY(`subscriber_id`, `topic`)
);
