import type { ECompanyTarget } from '../enums/company/target';
import type { EUserRole } from '../enums/user/role';

export type TAdvertisingCompanyFull = TInputAdvertisingCompany & {
  companyId: bigint;
  spent: number;
};

export type TUser = TInputUser & {
  user: string;
};

export type TInputUser = {
  role: EUserRole;
  email: string;
};

export type TInputAdvertisingCompany = TAdvertisingCompany & {
  users: TInputUser[] | null;
};

export type TResponseAdvertisingCompany = TAdvertisingCompany & {
  users: TUser[] | null;
};

export type TAdvertisingCompany = {
  name: string;
  contractNumber: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  color: string;
  target: ECompanyTarget;
  fileName: string | null;
  fileContent: string | null;
  plannedPosts: number | null;
  kpiTransitions: number | null;
  kpiCoverage: number | null;
};

export type TAdvertisingCompanyFullDb = TAdvertisingCompanyDb & {
  companyId: bigint;
  spent: number;
  users: TInputUser[] | null;
};

export type TAdvertisingCompanyDb = {
  name: string;
  contractNumber: string | null;
  startDate: Date | null;
  endDate: Date | null;
  budget: number | null;
  color: string;
  target: ECompanyTarget;
  fileName: string | null;
  fileDataIntro: string | null;
  bucketName: string | null;
  plannedPosts: number | null;
  kpiTransitions: number | null;
  kpiCoverage: number | null;
};

export type TGetFile = {
  name: string;
  intro: string;
  data: string;
};
