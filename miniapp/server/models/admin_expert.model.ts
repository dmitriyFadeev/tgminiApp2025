export type TAdminExpertFull = TCreateAdminExpert & {
    adminExpertId: bigint;
  };
  
  export type TAdminExpertFullWithToken = TAdminExpertFull & {
    refreshToken: string | null;
  };
  
  export type TCreateAdminExpert = TLoginAdminExpert & {
    name: string,
    surname: string,
    birthday: Date,
    town: string,
    cv: string,
    fileName: string | null,
    fileDataIntro: string | null,
    bucketName: string | null,
    interests: string[],
    role: string,
  };
  
  export type TLoginAdminExpert = {
    password: string;
    login: string;
  };
  
  export type TAdminExpertWithTokens = TAdminExpertWithRefreshToken & {
    accessToken: string;
  };
  
  export type TAdminExpertWithRefreshToken = {
    adminExpertId: bigint;
    refreshToken: string | null;
  };
  
  export type TAdminExpertCtx = {
    id: string;
    login: string;
  };
  
  export type TAEAuth = {
    accessToken: string;
    refreshToken: string;
  };
  