import { createCipheriv, createDecipheriv } from 'crypto';
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';

import { env } from '../../../env';
import type { Context } from '../context';
import type { TUserCtx } from '../models/user.model';
import { AdminExpertRepository } from '../repositories/admin_expert.repository';

export class CommonService {
  static async checkAuth(ctx: Context, adminCheck: boolean): Promise<TUserCtx> {
    if (!ctx.user) {
      throw new Error('Пользователь не авторизован');
    }
    if (adminCheck) {
      const user = await AdminExpertRepository.getAdminExpertById(BigInt(ctx.user.id));
      if (!user.role != true)
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Пользователь не администратор',
        });
    }
    const user = ctx.user;
    return user;
  }

  static convertToSnakeCase(str: string) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase();
  }

  static streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hash: string) {
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch)
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'login or password is wrong',
      });
  }

  static encrypt(text: string): string {
    const keyBuffer = Buffer.from(env.KEY, 'hex');
    const ivBuffer = Buffer.from(env.IV, 'hex');

    let cipher = createCipheriv(env.ALGORITHM, keyBuffer, ivBuffer);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return encrypted.toString('hex');
  }

  static decrypt(encryptedData: string): string {
    const ivBuffer = Buffer.from(env.IV, 'hex');
    const keyBuffer = Buffer.from(env.KEY, 'hex');

    const encryptedText = Buffer.from(encryptedData, 'hex');
    let decipher = createDecipheriv(env.ALGORITHM, keyBuffer, ivBuffer);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }
}
