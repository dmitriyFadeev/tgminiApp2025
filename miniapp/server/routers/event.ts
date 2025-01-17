import { EventRepository } from '../repositories/event.repository';
import { ErrorResponse } from '../responses/error-response';
import { CommonResponse } from '../responses/response';
import { CommonService } from '../services/common-service';
import { publicProcedure } from '../trpc';
import { StringSchema } from '../zod/common';
import {
  UpdateEventSchema,
  EventSchema,
  FiltersEventSchema,
} from '../zod/event';

export const EventRouter = {

  insert: publicProcedure.input(EventSchema).mutation(async (opts) => {
    try {
      const { input } = opts;
      const event = await EventRepository.insertEvent(input);
      return new CommonResponse({
        ...event,
        eventId: event.eventId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  list: publicProcedure.input(FiltersEventSchema).query(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      const events = await EventRepository.getEvents(input);
      const resAllEvents = events.allEvents.map((el) => ({
        ...el,
        eventId: String(el.eventId),
      }));
      const resEvents = events.filtered.map((el) => ({
        ...el,
        eventId: String(el.eventId),
      }));
      return new CommonResponse({
        filtered: resEvents,
        all: resAllEvents
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  getById: publicProcedure.input(StringSchema).query(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, false);
      const event = await EventRepository.getEventById(BigInt(input));
      return new CommonResponse({
        ...event,
        eventId: event.eventId.toString(),
      });
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  update: publicProcedure.input(UpdateEventSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      const event = await EventRepository.updateEvent({
        ...input,
        eventId: BigInt(input.eventId),
      });
      return new CommonResponse(event.toString());
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),

  delete: publicProcedure.input(StringSchema).mutation(async (opts) => {
    try {
      const { ctx, input } = opts;
      await CommonService.checkAuth(ctx, true);
      await EventRepository.deleteEvent(BigInt(input));
      return new CommonResponse(null);
    } catch (e) {
      const err = e as Error;
      return new ErrorResponse(err);
    }
  }),
};
