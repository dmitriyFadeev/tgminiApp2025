import { TRPCError } from '@trpc/server';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { pgUsers } from '../drizzle/schema';
import { env } from '../env';
import type {
  TCompanyToUser,
  TCompanyToUserResponse,
} from '../models/companies-to-users.model';
import type {
  TCreateUser,
  TUserFull,
  TUserFullWithToken,
  TUserRoleByComapnyId,
  TUserWithRefreshToken,
  TUserWithTokens,
} from '../models/user.model';
import { CommonService } from '../services/common-service';
import { AuthRepository } from './auth.repository';
import { CommentRepository } from './comment.repository';
import { FavouriteRepository } from './favourites.repository';
import { NotificationRepository } from './notification.repository';

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

  static async usersExist(emails: string[]): Promise<TUserFull[]> {
    let usersDb = [] as TUserFull[];
    if (emails) {
      usersDb = await db
        .select()
        .from(pgUsers)
        .where(inArray(pgUsers.email, emails));
      if (!usersDb.find((el) => el.email == env.ADMINEMAIL))
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'there is no admin user in db',
        });
      if (usersDb.length != emails.length)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'some of users had not been found',
        });
    }
    return usersDb;
  }

  static async register(email: string): Promise<number> {
    const code = Math.floor(Math.random() * 1000000);
    const result = await db
      .select()
      .from(pgUsers)
      .where(eq(pgUsers.email, email));
    const existingUser = result[0] as TUserFull;

    if (existingUser) {
      if (existingUser) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'user had been already registered',
        });
      }
    } else {
      sendMail({
        to: email,
        text: `Ваш код подтверждения регистрации ${code}`,
      });
    }

    return code;
  }

  static async insertUser(user: TCreateUser): Promise<TUserWithTokens> {
    const password = await CommonService.hashPassword(user.password);
    const result = await db
      .insert(pgUsers)
      .values({
        ...user,
        password,
      })
      .returning();
    const createdUser = result[0];
    const tokens = AuthRepository.generateTokens(
      createdUser.userId.toString(),
      createdUser.email
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

  static async getUserByEmail(email: string): Promise<TUserFull> {
    const result = await db
      .select()
      .from(pgUsers)
      .where(sql`LOWER(${pgUsers.email}) = LOWER(${email})`);
    const user = result[0] as TUserFull;
    if (!user || !user.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by email had not been found',
      });
    }
    return user;
  }

  static async getUserRoleByCompanyId(
    data: TUserRoleByComapnyId
  ): Promise<TCompanyToUser> {
    const result = await db
      .select()
      .from(pgCompaniesToUsers)
      .innerJoin(pgUsers, eq(pgUsers.userId, pgCompaniesToUsers.userId))
      .where(
        and(
          eq(pgCompaniesToUsers.companyId, BigInt(data.companyId)),
          eq(pgCompaniesToUsers.userId, BigInt(data.userId))
        )
      );
    const companyToUser = result[0]
      .companies_to_users as TCompanyToUserResponse;
    companyToUser.login = result[0].users.login;
    if (!companyToUser || !companyToUser.userId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'company to user had not been found',
      });
    }
    return companyToUser;
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
        password,
      })
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
    await CommentRepository.deleteCommentsByUserId(id.toString());
    await NotificationRepository.deleteNotificationsByUserId(id.toString());
    await FavouriteRepository.deleteFavouritesByUserId(id.toString());
    await db
      .delete(pgCompaniesToUsers)
      .where(eq(pgCompaniesToUsers.userId, id));
    const result = await db.delete(pgUsers).where(eq(pgUsers.userId, id));
    if (!result)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'user by id had not been found',
      });
  }
}
