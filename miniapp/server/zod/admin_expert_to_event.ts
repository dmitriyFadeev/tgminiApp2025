import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { pgAdminExpertsToEvents } from '../drizzle/schema';

export const baseSchema = createInsertSchema(pgAdminExpertsToEvents);

export const AdminExpertToEventSchema = baseSchema
  .omit({
    adminExpertId: true,
    eventId: true,
    isOrganizer: true,
  })
  .extend({
    adminExpertId: z.coerce.bigint(),
    eventId: z.coerce.bigint(),
    isOrganizer: z.boolean(),
  });
