import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { pgMessages } from '../drizzle/schema';
import db from '../../../db';
import type {
  TCreateMessage,
  TMessage,
} from '../models/message.model';

export class MessageRepository {

  static async insertMessage(message: TCreateMessage): Promise<TMessage> {
    const result = await db
      .insert(pgMessages)
      .values(message)
      .returning();
    const createdMessage = result[0];

    return createdMessage;
  }

  static async getMessageById(id: bigint): Promise<TMessage> {
    const result = await db
      .select()
      .from(pgMessages)
      .where(eq(pgMessages.messageId, id));
    const message:TMessage = result[0];
    if (!message || !message.messageId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'message by id had not been found',
      });
    }
    return message;
  }

  static async getMessages(): Promise<TMessage[]> {
    const result = await db.select().from(pgMessages);
    const messages:TMessage[] = result;
    return messages;
  }

  static async updateMessage(updatedMessage: TMessage): Promise<bigint> {
    const result = await db
      .update(pgMessages)
      .set(updatedMessage)
      .where(eq(pgMessages.messageId, updatedMessage.messageId))
      .returning();
    const message:TMessage = result[0];
    if (!message || !message.messageId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'message by email had not been found',
      });
    }
    return message.messageId;
  }

  static async deleteMessage(id: bigint): Promise<void> {
    const result = await db.delete(pgMessages).where(eq(pgMessages.messageId, id));
    if (!result)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'message by id had not been found',
      });
  }
}
