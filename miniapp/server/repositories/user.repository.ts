import { TRPCError } from '@trpc/server';
import { and, eq, inArray } from 'drizzle-orm';
import { pgUsers, pgUsersToEvents } from '../drizzle/schema';
import db from '../../../db';
import type {
  TCreateUser,
  TUserFull,
  TUserFullWithToken,
  TUserWithRefreshToken,
  TUserWithTokens,
} from '../models/user.model';
import { CommonService } from '../services/common-service';
import { AuthRepository } from './auth.repository';
import { EventRepository } from './event.repository';
import { TUserToEvent } from '../models/user_to_event.model';

export class UserRepository {
  static async updateRefreshToken(
    id: bigint,
    token: string | null
  ): Promise<TUserWithRefreshToken> {
    let refreshToken = null;
    if (token) refreshToken = await CommonService.hashPassword(token);

    const result = await db
      .update(pgUsers)
      .set({
        refreshToken,
      })
      .where(eq(pgUsers.userId, id))
      .returning();

    return {
      userId: result[0].userId,
      refreshToken: result[0].refreshToken,
    };
  }

  static async usersExist(logins: string[]): Promise<TUserFull[]> {
    let usersDb:TUserFull[] = [];
    if (logins) {
      usersDb = await db
        .select()
        .from(pgUsers)
        .where(inArray(pgUsers.login, logins));
      if (usersDb.length != logins.length)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'some of users had not been found',
        });
    }
    return usersDb;
  }

  static async deleteAllFromEvent(eventId: bigint){
    await db.delete(pgUsersToEvents)
      .where(eq(pgUsersToEvents.eventId, eventId))
  }

  static async insertUser(user: TCreateUser): Promise<TUserWithTokens> {
    const password = await CommonService.hashPassword(user.password);
    const result = await db
      .insert(pgUsers)
      .values({
        ...user,
        password})
      .returning();
    const createdUser = result[0];
    const tokens = AuthRepository.generateTokens(
      createdUser.userId.toString(),
      createdUser.login
    );
    const updatedUser = await this.updateRefreshToken(
      createdUser.userId,
      CommonService.encrypt(tokens.refreshToken)
    );

    return {
      userId: updatedUser.userId,
      refreshToken: updatedUser.refreshToken,
      accessToken: tokens.accessToken,
    };
  }

  static async getUserById(id: bigint): Promise<TUserFull> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.userId, id));
    const user:TUserFull = result[0];
    if (!user || !user.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by id had not been found',
      });
    }
    return user;
  }

  static async getUserByIdWithToken(id: bigint): Promise<TUserFullWithToken> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.userId, id));
    const user:TUserFullWithToken = result[0];
    if (!user || !user.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by id had not been found',
      });
    }
    return user;
  }

  static async addToEvent(data: TUserToEvent): Promise<TUserToEvent>{
    const event = await EventRepository.getEventById(data.eventId)
    //await EventRepository.updateFreeSpaces(event.eventId, event.freeSpaces--)
    await this.getUserById(data.userId)
    const result = await db.insert(pgUsersToEvents)
      .values(data)
      .returning();
    const inserted: TUserToEvent= result[0]
    return inserted
  }

  static async getUserEventByEvent(userId: bigint,eventId: bigint){
    const userEvents = await db
      .select()
      .from(pgUsersToEvents)
      .where(and(eq(pgUsersToEvents.userId, userId), eq(pgUsersToEvents.eventId, eventId)));
    const userEvent:TUserToEvent = userEvents[0];
    if (!userEvent || !userEvent.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by is not in event',
      });
    }
    return userEvent;
  }

  static async setUserEventApproved(
    adminExpertId: bigint,
    eventId: bigint
  ) {
    await db
      .update(pgUsersToEvents)
      .set({
        approved: true
      })
      .where(and(eq(pgUsersToEvents.userId, adminExpertId), eq(pgUsersToEvents.eventId, eventId)))
  }

  static async removeFromEvent(data: TUserToEvent): Promise<TUserToEvent>{
    const userEvent = await this.getUserEventByEvent(data.userId,data.eventId)
    if(userEvent.approved){
      const event = await EventRepository.getEventById(data.eventId)
      await EventRepository.updateFreeSpaces(event.eventId, event.freeSpaces++)
    }
      
    await this.getUserById(data.userId)
    const result = await db.delete(pgUsersToEvents)
      .where(and(
        eq(pgUsersToEvents.userId, data.userId), 
        eq(pgUsersToEvents.eventId, data.eventId)))
      .returning()
    const removed: TUserToEvent= result[0]
    return removed
  }

  static async getUserByLogin(login: string): Promise<TUserFull> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.login, login));
    const user:TUserFull = result[0];
    if (!user || !user.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by login had not been found',
      });
    }
    return user;
  }

  static async getUsers(): Promise<TUserFull[]> {
    const result:TUserFull[] = await db.select().from(pgUsers);
    return result;
  }

  static async updateUser(updatedUser: TUserFull): Promise<bigint> {
    const password = await CommonService.hashPassword(updatedUser.password);
    const result = await db
      .update(pgUsers)
      .set({
        ...updatedUser,
        password})
      .where(eq(pgUsers.userId, updatedUser.userId))
      .returning();
    const user:TUserFull = result[0];
    if (!user || !user.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by email had not been found',
      });
    }
    return user.userId;
  }

  static async deleteUser(id: bigint): Promise<void> {
    const result = await db.delete(pgUsers).where(eq(pgUsers.userId, id));
    if (!result)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by id had not been found',
      });
  }
}
