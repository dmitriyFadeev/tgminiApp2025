CREATE TABLE "admins_expers" (
	"login" text NOT NULL,
	"password" text NOT NULL,
	"admin_exprt_id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"birthday" timestamp NOT NULL,
	"town" text NOT NULL,
	"cv" text NOT NULL,
	"file_name" text,
	"file_data_intro" text,
	"bucket_name" text,
	"interests" text[] NOT NULL,
	"role" text NOT NULL,
	"refresh_token" text,
	CONSTRAINT "admins_expers_login_unique" UNIQUE("login")
);
--> statement-breakpoint
CREATE TABLE "users_to_events" (
	"user_id" bigint NOT NULL,
	"event_id" bigint NOT NULL,
	"is_organizer" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_to_events_user_id_event_id_pk" PRIMARY KEY("user_id","event_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"event_id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"date" timestamp NOT NULL,
	"free_spaces" integer DEFAULT 0 NOT NULL,
	"image_url" text NOT NULL,
	"description" text NOT NULL,
	"interests" text[] NOT NULL,
	CONSTRAINT "events_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"login" text NOT NULL,
	"password" text NOT NULL,
	"user_id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"surname" text NOT NULL,
	"birthday" timestamp NOT NULL,
	"company_name" text NOT NULL,
	"business_sector" text NOT NULL,
	"post" text NOT NULL,
	"file_name" text,
	"file_data_intro" text,
	"bucket_name" text,
	"interests" text[] NOT NULL,
	"role" text NOT NULL,
	"refresh_token" text,
	CONSTRAINT "users_login_unique" UNIQUE("login")
);
--> statement-breakpoint
ALTER TABLE "users_to_events" ADD CONSTRAINT "users_to_events_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users_to_events" ADD CONSTRAINT "users_to_events_event_id_events_event_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("event_id") ON DELETE no action ON UPDATE no action;