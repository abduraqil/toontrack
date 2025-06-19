CREATE TABLE "cartoons" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cartoons_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(128) NOT NULL,
	"description" varchar(512),
	"cover_pic" varchar(64),
	"status" smallint,
	"episodes" smallint,
	"air_start" timestamp,
	"air_end" timestamp,
	"source" varchar(64),
	"duration" smallint,
	"age_rating" varchar(32),
	"country" varchar(128),
	"original_language" varchar(128),
	"links" varchar(512),
	"created" timestamp DEFAULT now(),
	"edited" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userID" integer NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"username" varchar(64) NOT NULL,
	"bio" varchar(512),
	"prof_pic" varchar(64),
	"pwd" varchar(256) NOT NULL,
	"created" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userID_users_id_fk" FOREIGN KEY ("userID") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;