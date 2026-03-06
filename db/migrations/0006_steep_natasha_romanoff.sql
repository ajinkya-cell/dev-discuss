CREATE TABLE "solution_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"solution_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "solution_votes_user_id_solution_id_unique" UNIQUE("user_id","solution_id")
);
--> statement-breakpoint
ALTER TABLE "solution_votes" ADD CONSTRAINT "solution_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "solution_votes" ADD CONSTRAINT "solution_votes_solution_id_solutions_id_fk" FOREIGN KEY ("solution_id") REFERENCES "public"."solutions"("id") ON DELETE no action ON UPDATE no action;