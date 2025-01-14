import { MessageRepository } from '../repositories/message.repository';
import { ErrorResponse } from '../responses/error-response';
import { CommonResponse } from '../responses/response';
import { CommonService } from '../services/common-service';
import { publicProcedure } from '../trpc';
import { StringSchema } from '../zod/common';
import {
  UpdateMessageSchema,
  MessageSchema,
} from '../zod/message';

export const MessageRouter = {

  insert: publicProcedure.input(MessageSchema).mutation(async (opts) => {
    try {
      const { input } = opts;
      const message = await MessageRepository.insertMessage(input);
      return new CommonResponse({
        ...message,
        messageId: message.messageId.toString(),
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
      const messages = await MessageRepository.getMessages();
      const res = messages.map((el) => ({
        ...el,
        messageId: String(el.messageId),
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
      const message = await MessageRepository.getMessageById(BigInt(input));
      return new CommonResponse({
        ...message,
        messageId: message.messageId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  update: publicProcedure.input(UpdateMessageSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      const message = await MessageRepository.updateMessage({
        ...input,
        messageId: BigInt(input.messageId),
      });
      return new CommonResponse(message.toString());
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  delete: publicProcedure.input(StringSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      await MessageRepository.deleteMessage(BigInt(input));
      return new CommonResponse(null);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),
};
