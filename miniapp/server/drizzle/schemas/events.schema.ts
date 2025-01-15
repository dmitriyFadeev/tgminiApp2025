import { bigserial, boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const pgEventsSchema = pgTable('events', {
    eventId: bigserial('event_id', { mode: 'bigint' }).primaryKey(),
    name: text('name').unique().notNull(),
    date: timestamp('date').notNull(),
    freeSpaces: integer('free_spaces').notNull().default(0),
    imageUrl: text('image_url').notNull(),
    description: text('description').notNull(),
    interest: text('interest').notNull(),
    onWater: boolean("on_water").notNull().default(false),
    location: text('location').notNull(),
});