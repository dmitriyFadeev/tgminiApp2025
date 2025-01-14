import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { pgMessages } from '../drizzle/schema';

export const baseSchema = createInsertSchema(pgMessages);

export const MessageSchema = baseSchema
  .omit({
    text: true,
    userIdFrom: true,
    userIdTo: true,
    date: true,
    interest: true,
  })
  .extend({
    text: z.string(),
    userIdFrom: z.coerce.bigint(),
    userIdTo: z.coerce.bigint(),
    date: z.date(),
    interest: z.string(),
  });

export const UpdateMessageSchema = MessageSchema.extend({
    messageId: z.string(),
});