export type TLog = {
  target: string;
  timestamp: string;
  userId: string;
  operation: string;
  targetId: string;
};

export type TUpdateLog = TLog & {
  logId: string;
};

export type TClickhouseLog = {
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
      name: 'Logs';
      type: 'UInt64';
    },
  ];
  data: TLogData[];
};

export type TLogData = {
  target: string;
  timestamp: Date;
  user_id: string;
  operation: string;
  target_id: string;
};
