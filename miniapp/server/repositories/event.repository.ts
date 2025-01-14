import { TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { pgEvents } from '../drizzle/schema';
import db from '../../../db';
import type {
  TCreateEvent,
  TEvent,
} from '../models/event.model';
import { AdminExpertRepository } from './admin_expert.repository';
import { UserRepository } from './user.repository';

export class EventRepository {

  static async insertEvent(event: TCreateEvent): Promise<TEvent> {
    const result = await db
      .insert(pgEvents)
      .values(event)
      .returning();
    const createdEvent = result[0];

    return createdEvent;
  }

  static async getEventById(id: bigint): Promise<TEvent> {
    const result = await db
      .select()
      .from(pgEvents)
      .where(eq(pgEvents.eventId, id));
    const event:TEvent = result[0];
    if (!event || !event.eventId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'event by id had not been found',
      });
    }
    return event;
  }

  static async updateFreeSpaces(id: bigint, freeSpaces: number): Promise<TEvent> {
    const result = await db
      .update(pgEvents)
      .set({freeSpaces})
      .where(eq(pgEvents.eventId, id))
      .returning();
    const event:TEvent = result[0];
    if (!event || !event.eventId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'event by id had not been found',
      });
    }
    return event;
  }

  static async getEvents(): Promise<TEvent[]> {
    const result = await db.select().from(pgEvents);
    const events:TEvent[] = result;
    return events;
  }

  static async updateEvent(updatedEvent: TEvent): Promise<bigint> {
    const result = await db
      .update(pgEvents)
      .set(updatedEvent)
      .where(eq(pgEvents.eventId, updatedEvent.eventId))
      .returning();
    const event:TEvent = result[0];
    if (!event || !event.eventId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'event by email had not been found',
      });
    }
    return event.eventId;
  }

  static async deleteEvent(id: bigint): Promise<void> {
    const result = await db.delete(pgEvents).where(eq(pgEvents.eventId, id));
    if (!result)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'event by id had not been found',
      });
    await AdminExpertRepository.deleteAllFromEvent(id)
    await UserRepository.deleteAllFromEvent(id)
  }
}
