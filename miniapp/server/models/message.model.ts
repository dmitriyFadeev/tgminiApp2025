export type TCreateMessage = {
    text: string,
    date: Date,
    userIdFrom: bigint,
    userIdTo: bigint,
    interest: string,
};

export type TMessage = TCreateMessage & {
    messageId: bigint
}
