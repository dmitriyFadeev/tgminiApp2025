export type TNotification = {
  commentId: string;
  userId: string;
};

export type TClickhouseNotification = {
  meta: [
    {
      name: 'comment_id';
      type: 'String';
    },
    {
      name: 'user_id';
      type: 'String';
    },
    {
      name: 'viewed';
      type: 'Boolean';
    },
  ];
  data: TNotificationData[];
};

export type TNotificationData = {
  comment_id: string | null;
  text: string | null;
  company_id: string | null;
  user_id: string;
  viewed: boolean;
};
