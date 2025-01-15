export type TCreateEvent = {
    name: string,
    date: Date,
    freeSpaces: number,
    imageUrl: string,
    description: string,
    interest: string,
    onWater: boolean,
    location: string,
};

export type TEvent = TCreateEvent & {
    eventId: bigint
}

export type TFiltersEvent = {
    dateFrom: Date,
    dateTo: Date,
    freeSpaces: boolean,
    interests: string[],
    onWater: boolean,
    location: string,
}

export type TFiltersEventResponse = {
    allEvents: TEvent[]
    filtered: TEvent[]
}