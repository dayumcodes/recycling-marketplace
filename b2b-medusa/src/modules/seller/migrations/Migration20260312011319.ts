import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260312011319 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "seller" add column if not exists "user_id" text null, add column if not exists "description" text null, add column if not exists "is_verified" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "seller" drop column if exists "user_id", drop column if exists "description", drop column if exists "is_verified";`);
  }

}
