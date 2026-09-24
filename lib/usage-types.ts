export type WindowStats = {
  requests: number;
  tokens: number;
  cost: number;
  standardCost: number;
  userCost: number;
};

export type UsageWindow = {
  utilization: number;
  resetsAt: string;
  remainingSeconds: number;
  stats: WindowStats;
};

export type UsageData = {
  updatedAt: string;
  fiveHour: UsageWindow;
  sevenDay: UsageWindow;
};

export type UsageResult =
  | { ok: true; data: UsageData }
  | { ok: false; message: string };

export type AccountSummary = {
  id: number;
  name: string;
  platform: string;
  type: string;
  status: string;
};

export type AccountsResult =
  | { ok: true; data: AccountSummary[] }
  | { ok: false; message: string };

export type AccountUsage = {
  account: AccountSummary;
  usage: UsageResult;
};

export type AccountsUsageResult =
  | { ok: true; data: AccountUsage[] }
  | { ok: false; message: string };
