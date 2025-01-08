export type TTransition = TGetTransitionByCompanyId & {
  transitions: number;
  timestamp: string;
};

export type TUpdateTransition = TTransition & {
  transitionId: string;
};

export type TGetTransitionByCompanyId = {
  companyId: string;
};

// export type TGetTransition = TGetTransitionByCompanyId & {
//   timestamp: string;
// };

export type TClickhouseTransition = {
  meta: [
    {
      name: 'company_id';
      type: 'String';
    },
    {
      name: 'timestamp';
      type: 'DateTime';
    },
    {
      name: 'transitions';
      type: 'UInt64';
    },
  ];
  data: TTransitionData[];
};

type TTransitionData = {
  company_id: string;
  timestamp: string;
  transitions: string;
};
