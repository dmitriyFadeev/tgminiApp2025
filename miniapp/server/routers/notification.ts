import { NotificationRepository } from '../repositories/notification.repository';
import { ErrorResponse } from '../responses/error-response';
import { CommonResponse } from '../responses/response';
import { CommonService } from '../services/common-service';
import { publicProcedure } from '../trpc';
import { StringSchema } from '../zod/common';
import {
  UpdateNotificationSchema,
  NotificationSchema,
} from '../zod/notification';

export const NotificationRouter = {

  insert: publicProcedure.input(NotificationSchema).mutation(async (opts) => {
    try {
      const { input } = opts;
      const notification = await NotificationRepository.insertNotification(input);
      return new CommonResponse({
        ...notification,
        notificationId: notification.notificationId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  list: publicProcedure.query(async (opts) => {
    try {
      const { ctx } = opts;
      await CommonService.checkAuth(ctx, true);
      const notifications = await NotificationRepository.getNotifications();
      const res = notifications.map((el) => ({
        ...el,
        notificationId: String(el.notificationId),
      }));
      return new CommonResponse(res);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  getById: publicProcedure.input(StringSchema).query(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, false);
      const notification = await NotificationRepository.getNotificationById(BigInt(input));
      return new CommonResponse({
        ...notification,
        notificationId: notification.notificationId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  update: publicProcedure.input(UpdateNotificationSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      const notification = await NotificationRepository.updateNotification({
        ...input,
        notificationId: BigInt(input.notificationId),
      });
      return new CommonResponse(notification.toString());
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  delete: publicProcedure.input(StringSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      await NotificationRepository.deleteNotification(BigInt(input));
      return new CommonResponse(null);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),
};
