ALTER TABLE "admins_expers" RENAME TO "admins_experts";--> statement-breakpoint
ALTER TABLE "admins_experts" RENAME COLUMN "admin_exprt_id" TO "admin_expert_id";--> statement-breakpoint
ALTER TABLE "admins_experts" DROP CONSTRAINT "admins_expers_login_unique";--> statement-breakpoint
ALTER TABLE "admins_experts" ADD CONSTRAINT "admins_experts_login_unique" UNIQUE("login");