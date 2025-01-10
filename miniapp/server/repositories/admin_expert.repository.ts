import { TRPCError } from '@trpc/server';
import { eq, inArray } from 'drizzle-orm';
import { pgAdminExperts } from '../drizzle/schema';
import db from '../../../db';
import type {
  TCreateAdminExpert,
  TAdminExpertFull,
  TAdminExpertFullWithToken,
  TAdminExpertWithRefreshToken,
  TAdminExpertWithTokens,
} from '../models/admin_expert.model';
import { CommonService } from '../services/common-service';
import { AuthRepository } from './auth.repository';

export class AdminExpertRepository {
  static async updateRefreshToken(
    id: bigint,
    token: string | null
  ): Promise<TAdminExpertWithRefreshToken> {
    let refreshToken = null;
    if (token) refreshToken = await CommonService.hashPassword(token);

    const result = await db
      .update(pgAdminExperts)
      .set({
        refreshToken,
      })
      .where(eq(pgAdminExperts.adminExpertId, id))
      .returning();

    return {
      adminExpertId: result[0].adminExpertId,
      refreshToken: result[0].refreshToken,
    };
  }

  static async adminExpertsExist(logins: string[]): Promise<TAdminExpertFull[]> {
    let adminExpertsDb = [] as TAdminExpertFull[];
    if (logins) {
      adminExpertsDb = await db
        .select()
        .from(pgAdminExperts)
        .where(inArray(pgAdminExperts.login, logins));
      if (adminExpertsDb.length != logins.length)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'some of adminExperts had not been found',
        });
    }
    return adminExpertsDb;
  }

  static async insertAdminExpert(adminExpert: TCreateAdminExpert): Promise<TAdminExpertWithTokens> {
    const password = await CommonService.hashPassword(adminExpert.password);
    const result = await db
      .insert(pgAdminExperts)
      .values({
        ...adminExpert,
        password,
      })
      .returning();
    const createdAdminExpert = result[0];
    const tokens = AuthRepository.generateTokens(
      createdAdminExpert.adminExpertId.toString(),
      createdAdminExpert.login
    );
    const updatedAdminExpert = await this.updateRefreshToken(
      createdAdminExpert.adminExpertId,
      CommonService.encrypt(tokens.refreshToken)
    );

    return {
      adminExpertId: updatedAdminExpert.adminExpertId,
      refreshToken: updatedAdminExpert.refreshToken,
      accessToken: tokens.accessToken,
    };
  }

  static async getAdminExpertById(id: bigint): Promise<TAdminExpertFull> {
    const result = await db
      .select()
      .from(pgAdminExperts)
      .where(eq(pgAdminExperts.adminExpertId, id));
    const adminExpert = result[0] as TAdminExpertFull;
    if (!adminExpert || !adminExpert.adminExpertId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'adminExpert by id had not been found',
      });
    }
    return adminExpert;
  }

  static async getAdminExpertByIdWithToken(id: bigint): Promise<TAdminExpertFullWithToken> {
    const result = await db
      .select()
      .from(pgAdminExperts)
      .where(eq(pgAdminExperts.adminExpertId, id));
    const adminExpert = result[0] as TAdminExpertFullWithToken;
    if (!adminExpert || !adminExpert.adminExpertId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'adminExpert by id had not been found',
      });
    }
    return adminExpert;
  }

  static async getAdminExpertByLogin(login: string): Promise<TAdminExpertFull> {
    const result = await db
      .select()
      .from(pgAdminExperts)
      .where(eq(pgAdminExperts.login, login));
    const adminExpert = result[0] as TAdminExpertFull;
    if (!adminExpert || !adminExpert.adminExpertId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'adminExpert by login had not been found',
      });
    }
    return adminExpert;
  }

  static async getAdminExperts(): Promise<TAdminExpertFull[]> {
    const result = await db.select().from(pgAdminExperts);
    const adminExperts = result as TAdminExpertFull[];
    return adminExperts;
  }

  static async updateAdminExpert(updatedAdminExpert: TAdminExpertFull): Promise<bigint> {
    const password = await CommonService.hashPassword(updatedAdminExpert.password);
    const result = await db
      .update(pgAdminExperts)
      .set({
        ...updatedAdminExpert,
        password,
      })
      .where(eq(pgAdminExperts.adminExpertId, updatedAdminExpert.adminExpertId))
      .returning();
    const adminExpert = result[0] as TAdminExpertFull;
    if (!adminExpert || !adminExpert.adminExpertId) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'adminExpert by email had not been found',
      });
    }
    return adminExpert.adminExpertId;
  }

  static async deleteAdminExpert(id: bigint): Promise<void> {
    const result = await db.delete(pgAdminExperts).where(eq(pgAdminExperts.adminExpertId, id));
    if (!result)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'adminExpert by id had not been found',
      });
  }
}
