import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { pgNotifications } from '../drizzle/schema';
import db from '../../../db';
import type {
  TCreateNotification,
  TNotification,
} from '../models/notification.model';

export class NotificationRepository {

  static async insertNotification(notification: TCreateNotification): Promise<TNotification> {
    const result = await db
      .insert(pgNotifications)
      .values(notification)
      .returning();
    const createdNotification = result[0];

    return createdNotification;
  }

  static async getNotificationById(id: bigint): Promise<TNotification> {
    const result = await db
      .select()
      .from(pgNotifications)
      .where(eq(pgNotifications.notificationId, id));
    const notification:TNotification = result[0];
    if (!notification || !notification.notificationId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'notification by id had not been found',
      });
    }
    return notification;
  }

  static async getNotifications(): Promise<TNotification[]> {
    const result:TNotification[] = await db.select().from(pgNotifications);
    return result;
  }

  static async updateNotification(updatedNotification: TNotification): Promise<bigint> {
    const result = await db
      .update(pgNotifications)
      .set(updatedNotification)
      .where(eq(pgNotifications.notificationId, updatedNotification.notificationId))
      .returning();
    const notification:TNotification = result[0];
    if (!notification || !notification.notificationId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'notification by email had not been found',
      });
    }
    return notification.notificationId;
  }

  static async deleteNotification(id: bigint): Promise<void> {
    const result = await db.delete(pgNotifications).where(eq(pgNotifications.notificationId, id));
    if (!result)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'notification by id had not been found',
      });
  }
}
