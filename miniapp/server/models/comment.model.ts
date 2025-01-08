export type TComment = {
  comment: string;
  timestamp: string;
  userId: string;
  postId: string;
};

export type TUpdateComment = TComment & {
  commentId: string;
};

export type TClickhouseComment = {
  meta: [
    {
      name: 'comment_id';
      type: 'String';
    },
    {
      name: 'post_id';
      type: 'String';
    },
    {
      name: 'timestamp';
      type: 'DateTime';
    },
    {
      name: 'comment';
      type: 'String';
    },
    {
      name: 'user_id';
      type: 'String';
    },
  ];
  data: TCommentData[];
};

export type TCommentData = {
  comment_id: string;
  post_id: string;
  timestamp: string;
  comment: string;
  user_id: string;
};
