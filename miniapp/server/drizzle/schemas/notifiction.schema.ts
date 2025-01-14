import { bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pgNotificationsSchema = pgTable('notifications', {
    date: timestamp('birthday').notNull(),
    text:  text('text').unique().notNull(),
    notificationId: bigserial('user_id', { mode: 'bigint' }).primaryKey(),
    firebaseFcmToken: text('firebase_fcm_token').notNull()
});