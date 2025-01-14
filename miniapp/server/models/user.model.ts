export type TUserFull = TCreateUser & {
  userId: bigint;
};

export type TUserFullWithToken = TUserFull & {
  refreshToken: string | null;
};

export type TCreateUser = TLoginUser & {
  name: string,
  surname: string,
  birthday: Date,
  companyName: string,
  businessSector: string,
  post: string,
  fileName: string | null,
  fileDataIntro: string | null,
  bucketName: string | null,
  interests: string[],
  role: string,
  firebaseFcmToken: string
};

export type TLoginUser = {
  password: string;
  login: string;
};

export type TUserWithTokens = TUserWithRefreshToken & {
  accessToken: string;
};

export type TUserWithRefreshToken = {
  userId: bigint;
  refreshToken: string | null;
};

export type TUserCtx = {
  id: string;
  login: string;
};

export type TAuth = {
  accessToken: string;
  refreshToken: string;
};
