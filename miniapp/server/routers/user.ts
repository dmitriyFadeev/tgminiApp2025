import { UserRepository } from '../repositories/user.repository';
import { ErrorResponse } from '../responses/error-response';
import { CommonResponse } from '../responses/response';
import { CommonService } from '../services/common-service';
import { publicProcedure } from '../trpc';
import { StringSchema } from '../zod/common';
import {
  UpdateUserSchema,
  UserSchema,
} from '../zod/user';

export const UserRouter = {

  insert: publicProcedure.input(UserSchema).mutation(async (opts) => {
    try {
      const { input } = opts;
      const user = await UserRepository.insertUser(input);
      return new CommonResponse({
        ...user,
        userId: user.userId.toString(),
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
      const users = await UserRepository.getUsers();
      const res = users.map((el) => ({
        ...el,
        userId: String(el.userId),
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
      const user = await UserRepository.getUserById(BigInt(input));
      return new CommonResponse({
        ...user,
        userId: user.userId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  getByLogin: publicProcedure.input(StringSchema).query(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, false);
      const user = await UserRepository.getUserByLogin(input);
      return new CommonResponse({
        ...user,
        userId: user.userId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  update: publicProcedure.input(UpdateUserSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      const user = await UserRepository.updateUser({
        ...input,
        userId: BigInt(input.userId),
      });
      return new CommonResponse(user.toString());
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  delete: publicProcedure.input(StringSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      await UserRepository.deleteUser(BigInt(input));
      return new CommonResponse(null);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),
};
