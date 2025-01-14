import { pgTable, bigint, primaryKey, boolean } from 'drizzle-orm/pg-core';
import { pgUsers, pgEvents } from '../schema';

const pgUsersToEventsSchema = pgTable(
    'users_to_events',
    {
        userId: bigint('user_id', { mode: 'bigint' })
            .notNull()
            .references(() => pgUsers.userId),
        eventId: bigint('event_id', { mode: 'bigint' })
            .notNull()
            .references(() => pgEvents.eventId),
        isOrganizer: boolean("is_organizer").notNull().default(false),
        approved: boolean("approved").notNull().default(false)
    },
    (t) => {
      return {
        pk: primaryKey({ columns: [t.userId, t.eventId] }),
      };
    }
  );
  
  export { pgUsersToEventsSchema };