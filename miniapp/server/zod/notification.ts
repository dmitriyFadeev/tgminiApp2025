import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { pgNotifications } from '../drizzle/schema';

export const baseSchema = createInsertSchema(pgNotifications);

export const NotificationSchema = baseSchema
  .omit({
    date: true,
    text: true,
    notificationId: true,
    firebaseFcmToken: true,
  })
  .extend({
    text: z.string(),
    notificationId: z.coerce.bigint(),
    firebaseFcmToken: z.string(),
    date: z.date(),
    interest: z.string(),
  });

export const UpdateNotificationSchema = NotificationSchema.extend({
    notificationId: z.string(),
});