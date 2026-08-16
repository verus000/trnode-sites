import type { UsageData, UsageWindow } from "./usage-types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readFiniteNumber(record: UnknownRecord, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Invalid number field: ${key}`);
  }
  return value;
}

function readString(record: UnknownRecord, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid string field: ${key}`);
  }
  return value;
}

function readRecord(record: UnknownRecord, key: string): UnknownRecord {
  const value = record[key];
  if (!isRecord(value)) {
    throw new Error(`Invalid object field: ${key}`);
  }
  return value;
}

function parseWindow(value: unknown): UsageWindow {
  if (!isRecord(value)) {
    throw new Error("Invalid usage window");
  }

  const stats = readRecord(value, "window_stats");
  return {
    utilization: readFiniteNumber(value, "utilization"),
    resetsAt: readString(value, "resets_at"),
    remainingSeconds: readFiniteNumber(value, "remaining_seconds"),
    stats: {
      requests: readFiniteNumber(stats, "requests"),
      tokens: readFiniteNumber(stats, "tokens"),
      cost: readFiniteNumber(stats, "cost"),
      standardCost: readFiniteNumber(stats, "standard_cost"),
      userCost: readFiniteNumber(stats, "user_cost"),
    },
  };
}

export function parseUsageResponse(payload: unknown): UsageData {
  if (!isRecord(payload)) {
    throw new Error("Invalid response body");
  }

  if (readFiniteNumber(payload, "code") !== 0) {
    throw new Error("Upstream business error");
  }

  const data = readRecord(payload, "data");
  return {
    updatedAt: readString(data, "updated_at"),
    fiveHour: parseWindow(data.five_hour),
    sevenDay: parseWindow(data.seven_day),
  };
}
