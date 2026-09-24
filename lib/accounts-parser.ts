import type { AccountSummary } from "./usage-types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readInteger(value: unknown, minimum: number): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < minimum) {
    throw new Error("Invalid account integer field");
  }
  return value;
}

function readString(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("Invalid account string field");
  }
  return value;
}

function parseAccount(value: unknown): AccountSummary {
  if (!isRecord(value)) {
    throw new Error("Invalid account");
  }

  // 仅提取页面需要的字段，不透传上游账号凭据等管理数据。
  return {
    id: readInteger(value.id, 1),
    name: readString(value.name ?? "").trim(),
    platform: readString(value.platform),
    type: readString(value.type),
    status: readString(value.status),
  };
}

export function parseAccountsResponse(payload: unknown): {
  items: AccountSummary[];
  page: number;
  pages: number;
} {
  if (!isRecord(payload) || payload.code !== 0 || !isRecord(payload.data)) {
    throw new Error("Invalid accounts response");
  }

  const data = payload.data;
  if (!Array.isArray(data.items)) {
    throw new Error("Invalid accounts list");
  }

  const page = readInteger(data.page, 1);
  const pages = readInteger(data.pages, 0);
  if ((data.items.length > 0 && page > pages) || (data.items.length === 0 && page < pages)) {
    throw new Error("Invalid accounts pagination");
  }

  return { items: data.items.map(parseAccount), page, pages };
}
