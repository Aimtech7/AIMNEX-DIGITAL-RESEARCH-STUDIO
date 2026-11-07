import {sqliteTable,text,index} from 'drizzle-orm/sqlite-core';
export const records=sqliteTable('studio_records',{id:text('id').primaryKey(),owner:text('owner').notNull(),kind:text('kind').notNull(),parent:text('parent'),data:text('data').notNull(),created:text('created').notNull()},t=>[index('records_owner').on(t.owner),index('records_parent').on(t.parent)]);
export const members=sqliteTable('studio_members',{id:text('id').primaryKey(),workspace:text('workspace').notNull(),email:text('email').notNull(),role:text('role').notNull(),cases:text('cases').notNull(),created:text('created').notNull()},t=>[index('members_workspace').on(t.workspace),index('members_email').on(t.email)]);
export const locks=sqliteTable('studio_locks',{id:text('id').primaryKey(),expires:text('expires').notNull()});
export const budgets=sqliteTable('studio_ai_budget',{id:text('id').primaryKey(),used:text('used').notNull()});
export const schedulerSecrets=sqliteTable('studio_scheduler_secrets',{workspace:text('workspace').primaryKey(),hash:text('hash').notNull(),created:text('created').notNull()});
