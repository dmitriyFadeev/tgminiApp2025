export type TCompanyToUser = {
  companyId: bigint;
  role: string;
  userId: bigint;
  approved: boolean;
};

export type TCompanyToUserResponse = {
  companyId: bigint;
  role: string;
  userId: bigint;
  approved: boolean;
  login: string;
};

export type TCompanyToUserMail = {
  companyId: bigint;
  role: string;
  userId: bigint;
  approved: boolean;
  email: string;
};
