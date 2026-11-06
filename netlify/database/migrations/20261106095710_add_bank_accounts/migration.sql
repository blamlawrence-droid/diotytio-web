CREATE TABLE "bank_accounts" (
	"id" text PRIMARY KEY,
	"user_id" text NOT NULL,
	"number" text NOT NULL,
	"country_code" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "bank_accounts_user_idx" ON "bank_accounts" ("user_id");--> statement-breakpoint
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;