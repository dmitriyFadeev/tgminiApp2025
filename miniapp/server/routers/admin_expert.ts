import { AdminExpertRepository } from '../repositories/admin_expert.repository';
import { ErrorResponse } from '../responses/error-response';
import { CommonResponse } from '../responses/response';
import { CommonService } from '../services/common-service';
import { publicProcedure } from '../trpc';
import { StringSchema } from '../zod/common';
import {
  UpdateAdminExpertSchema,
  AdminExpertSchema,
} from '../zod/admin_expert';

export const AdminExpertRouter = {

  insert: publicProcedure.input(AdminExpertSchema).mutation(async (opts) => {
    try {
      const { input } = opts;
      const adminExpert = await AdminExpertRepository.insertAdminExpert(input);
      return new CommonResponse({
        ...adminExpert,
        adminExpertId: adminExpert.adminExpertId.toString(),
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
      const adminExperts = await AdminExpertRepository.getAdminExperts();
      const res = adminExperts.map((el) => ({
        ...el,
        adminExpertId: String(el.adminExpertId),
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
      const adminExpert = await AdminExpertRepository.getAdminExpertById(BigInt(input));
      return new CommonResponse({
        ...adminExpert,
        adminExpertId: adminExpert.adminExpertId.toString(),
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
      const adminExpert = await AdminExpertRepository.getAdminExpertByLogin(input);
      return new CommonResponse({
        ...adminExpert,
        adminExpertId: adminExpert.adminExpertId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  update: publicProcedure.input(UpdateAdminExpertSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      const adminExpert = await AdminExpertRepository.updateAdminExpert({
        ...input,
        adminExpertId: BigInt(input.adminExpertId),
      });
      return new CommonResponse(adminExpert.toString());
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  delete: publicProcedure.input(StringSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      await AdminExpertRepository.deleteAdminExpert(BigInt(input));
      return new CommonResponse(null);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),
};
