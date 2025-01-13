import { bigint, bigserial, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { pgUsers } from "../schema";

export const pgMessagesSchema = pgTable('messages', {
    messageId: bigserial('message_id', { mode: 'bigint' }).primaryKey(),
    text: text('text').notNull(),
    userIdFrom: bigint('user_id_from', { mode: 'bigint' })
        .notNull()
        .references(() => pgUsers.userId),
    userIdTo: bigint('user_id_to', { mode: 'bigint' })
        .notNull()
        .references(() => pgUsers.userId),
    date: timestamp('date').notNull(),
    interest: text('interest').notNull(),
});