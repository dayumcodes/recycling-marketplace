import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260302120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "seller" add column if not exists "admin_user_id" text null;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "seller" drop column if exists "admin_user_id";`
    );
  }
}
