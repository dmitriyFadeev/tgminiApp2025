export type TUserFull = TCreateUser & {
  userId: bigint;
};

export type TUserFullWithToken = TUserFull & {
  refreshToken: string;
};

export type TCreateUser = TLoginUser & {
  login: string;
  isAdmin: boolean;
};

export type TLoginUser = {
  password: string;
  email: string;
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
  email: string;
};

export type TUserRoleByComapnyId = {
  userId: string;
  companyId: string;
};

export type TAuth = {
  accessToken: string;
  refreshToken: string;
};
