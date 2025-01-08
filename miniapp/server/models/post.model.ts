import type { EPostFormat } from '../enums/post/format';
import type { EPostStatus } from '../enums/post/status';
import type { TGetFile } from './advertising-company.model';

export type TPost = {
  text: string;
  channelSubs: number | null;
  channelName: string;
  channelUrl: string;
  timestamp: string | null;
  companyId: string;
  status: EPostStatus;
  reason: string | null;
  format: EPostFormat | null;
  creativeUrl: string;
  coverage: number | null;
  cpm: number | null;
  kpiCoverage: number | null;
  err: number | null;
  transitions: number | null;
  cpl: number | null;
  kpiTransitions: number | null;
  ytm: string | null;
  images: TPostImage[] | null;
};

export type TPostFilters = {
  channelName: string[] | null;
  channelSubs: number[] | null;
  status: EPostStatus[] | null;
  format: EPostFormat[] | null;
};

export type TSort = {
  minToMax: boolean;
  maxToMin: boolean;
  default: boolean;
};

export type TPostSort = {
  timestamp: TSort;
  channelName: TSort;
  channelSubs: TSort;
  coverage: TSort;
  cpm: TSort;
  kpiCoverage: TSort;
  err: TSort;
  transitions: TSort;
  cpl: TSort;
  kpiTransitions: TSort;
};

export type TPostFiltersData = {
  filters: TPostFilters;
  sort: TPostSort;
};

export type TPostImage = {
  imageName: string;
  imageContent: string;
};

export type TGetPostByChannelId = {
  channelId: string;
  companyId: string;
};

export type TGetPost = TGetPostByChannelId & {
  timestamp: string;
};

export type TUpdatePost = TPost & {
  postId: string;
};

export type TClickhousePost = {
  meta: unknown;
  data: TPostData[];
};

export type TPostData = TPostCommon & {
  images: TPostFilesDb[];
};

export type TGetPosts = {
  filters: {
    subsMin: number;
    subsMax: number;
    allChannels: string[];
  };
  data: TPostData[];
};

export type TClickhousePostFilters = {
  meta: unknown;
  data: TPostDataFilters[];
};

export type TPostDataFilters = {
  channelName: string;
  channelSubs: number | null;
};

export type TPostCommon = {
  text: string;
  post_id: string;
  channel_subs: number | null;
  channel_name: string;
  channel_url: string;
  channel_id: string;
  timestamp: string | null;
  company_id: string;
  status: EPostStatus;
  reason: string | null;
  format: EPostFormat | null;
  creative_url: string;
  coverage: number | null;
  cpm: number | null;
  kpi_coverage: number | null;
  err: number | null;
  transitions: number | null;
  cpl: number | null;
  kpi_transitions: number | null;
  ytm: string | null;
};

export type TPostFilesDb = {
  image_name: string;
  image_data_intro: string;
  bucket_name: string;
};

export type TGetPostImages = TPostCommon & {
  images: TGetFile[];
};
