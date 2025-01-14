export type TCreateNotification = {
    date: Date;
    text: string;
    firebaseFcmToken: string;
};

export type TNotification = TCreateNotification & {
    notificationId: bigint
}

