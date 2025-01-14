import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pgAdminsExpersSchema = pgTable('admins_experts', {
    login: text('login').unique().notNull(),
    password: text('password').notNull(),
    adminExpertId: bigserial('admin_expert_id', { mode: 'bigint' }).primaryKey(),
    name: text('name').notNull(),
    surname: text('surname').notNull(),
    birthday: timestamp('birthday').notNull(),
    town: text('town').notNull(),
    cv: text('cv').notNull(),
    fileName: text('file_name'),
    fileDataIntro: text('file_data_intro'),
    bucketName: text('bucket_name'),
    interests: text('interests').array().notNull(),
    role: text('role').notNull(),
    refreshToken: text('refresh_token'),
});