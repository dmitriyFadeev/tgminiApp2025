import { pgUsersSchema, pgAdminsExpersSchema, pgEventsSchema, pgAdminExpertsToEventsSchema, pgUsersToEventsSchema, pgMessagesSchema } from './schemas'

export const pgUsers = pgUsersSchema
export const pgEvents = pgEventsSchema
export const pgAdminExperts = pgAdminsExpersSchema
export const pgAdminExpertsToEvents = pgAdminExpertsToEventsSchema
export const pgUsersToEvents = pgUsersToEventsSchema
export const pgMessages = pgMessagesSchema