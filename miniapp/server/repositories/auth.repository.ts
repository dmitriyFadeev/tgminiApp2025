import { TRPCError } from '@trpc/server';
import jwt from 'jsonwebtoken';

import { env } from '../../../env';
import type { TAuth, TLoginUser, TUserWithTokens } from '../models/user.model';
import { CommonService } from '../services/common-service';
import { UserRepository } from './user.repository';

export class AuthRepository {
  static generateTokens(id: string, login: string): TAuth {
    const accessToken = jwt.sign({ id, login }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRATION,
    });

    const refreshToken = jwt.sign({ id, login }, env.JWT_SECRET, {
      expiresIn: env.REFRESH_TOKEN_EXPIRATION,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  static async login(user: TLoginUser): Promise<TUserWithTokens> {
    const foundUser = await UserRepository.getUserByLogin(user.login);
    await CommonService.verifyPassword(user.password, foundUser.password);
    const tokens = this.generateTokens(
      foundUser.userId.toString(),
      foundUser.login
    );
    await UserRepository.updateRefreshToken(
      foundUser.userId,
      CommonService.encrypt(tokens.refreshToken)
    );

    return {
      userId: foundUser.userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  static async refresh(
    userId: string,
    token: string
  ): Promise<TUserWithTokens> {
    const foundUser = await UserRepository.getUserByIdWithToken(BigInt(userId));
    const JWT_SECRET = env.JWT_SECRET;
    jwt.verify(token, JWT_SECRET);
    const tokens = this.generateTokens(
      foundUser.userId.toString(),
      foundUser.login
    );
    await UserRepository.updateRefreshToken(
      foundUser.userId,
      CommonService.encrypt(tokens.refreshToken)
    );

    return {
      userId: foundUser.userId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }
}
