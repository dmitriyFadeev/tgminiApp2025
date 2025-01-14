import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pgUsersSchema = pgTable('users', {
    login: text('login').unique().notNull(),
    password: text('password').notNull(),
    userId: bigserial('user_id', { mode: 'bigint' }).primaryKey(),
    name: text('name').notNull(),
    surname: text('surname').notNull(),
    birthday: timestamp('birthday').notNull(),
    companyName: text('company_name').notNull(),
    businessSector: text('business_sector').notNull(),
    post: text('post').notNull(),
    fileName: text('file_name'),
    fileDataIntro: text('file_data_intro'),
    bucketName: text('bucket_name'),
    interests: text('interests').array().notNull(),
    role: text('role').notNull(),
    refreshToken: text('refresh_token'),
    firebaseFcmToken: text('firebase_fcm_token').notNull()
});