import type { ECountry } from '../enums/channel/country';
import type { ELanguage } from '../enums/channel/language';

export type TChannelFull = TChannel & {
  id: bigint;
};

export type TChannel = TCreateChannel & {
  added: Date | null;
};

export type TCreateChannel = {
  username: string;
  subscribersCount: number;
  title: string;
  description: string | null;
  created: Date | null;
  pfpUpdated: Date | null;
  pfpUpdatedRu: Date | null;
  country: ECountry | null;
  language: ELanguage | null;
  userId: string | null;
  verified: boolean;
};
