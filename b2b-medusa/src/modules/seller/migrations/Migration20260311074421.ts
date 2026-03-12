import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260311074421 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "seller" ("id" text not null, "name" text not null, "handle" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "seller_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_seller_deleted_at" ON "seller" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "seller" cascade;`);
  }

}
