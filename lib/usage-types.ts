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
