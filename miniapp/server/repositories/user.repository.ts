import { TRPCError } from '@trpc/server';
import { eq, inArray } from 'drizzle-orm';
import { pgUsers } from '../drizzle/schema';
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
    let usersDb = [] as TUserFull[];
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
    const user = result[0] as TUserFull;
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
    const user = result[0] as TUserFullWithToken;
    if (!user || !user.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by id had not been found',
      });
    }
    return user;
  }

  static async getUserByLogin(login: string): Promise<TUserFull> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.login, login));
    const user = result[0] as TUserFull;
    if (!user || !user.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by login had not been found',
      });
    }
    return user;
  }

  static async getUsers(): Promise<TUserFull[]> {
    const result = await db.select().from(pgUsers);
    const users = result as TUserFull[];
    return users;
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
    const user = result[0] as TUserFull;
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
