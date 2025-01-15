import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { pgEvents } from '../drizzle/schema';

export const baseSchema = createInsertSchema(pgEvents);

export const EventSchema = baseSchema
  .omit({
    name: true,
    date: true,
    freeSpaces: true,
    imageUrl: true,
    description: true,
    interest: true,
  })
  .extend({
    name: z.string(),
    freeSpaces: z.number(),
    date: z.date(),
    imageUrl: z.string(),
    description: z.string(),
    interest: z.string(),
  });

export const UpdateEventSchema = EventSchema.extend({
    eventId: z.string(),
});