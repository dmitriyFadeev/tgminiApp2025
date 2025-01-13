export type TCreateEvent = {
    name: string,
    date: Date,
    freeSpaces: number,
    imageUrl: string,
    description: string,
    interests: string[],
};

export type TEvent = TCreateEvent & {
    eventId: bigint
}