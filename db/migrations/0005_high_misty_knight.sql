CREATE TABLE "problem_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"problem_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "problem_votes_user_id_problem_id_unique" UNIQUE("user_id","problem_id")
);
--> statement-breakpoint
ALTER TABLE "problem_votes" ADD CONSTRAINT "problem_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "problem_votes" ADD CONSTRAINT "problem_votes_problem_id_problems_id_fk" FOREIGN KEY ("problem_id") REFERENCES "public"."problems"("id") ON DELETE no action ON UPDATE no action;