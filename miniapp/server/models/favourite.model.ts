export type TFavourite = {
  userId: string;
  postId: string;
};

export type TUpdateFavourite = TFavourite & {
  favouriteId: string;
};

export type TClickhouseFavourite = {
  meta: [
    {
      name: 'favourite_id';
      type: 'String';
    },
    {
      name: 'user_id';
      type: 'String';
    },
    {
      name: 'post_id';
      type: 'String';
    },
  ];
  data: TFavouriteData[];
};

export type TFavouriteData = {
  favourite_id: string;
  user_id: string;
  post_id: string;
};
