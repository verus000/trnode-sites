import "server-only";

import { requestAccountUsage } from "./usage-request";
import type { UsageResult } from "./usage-types";

export async function getAccountUsage(): Promise<UsageResult> {
  const apiKey = process.env.UPSTREAM_API_KEY;
  if (!apiKey) {
    return { ok: false, message: "服务端尚未配置访问凭据。" };
  }

  return requestAccountUsage({
    apiKey,
    baseUrl: process.env.UPSTREAM_BASE_URL ?? "https://gpt.trnode.top",
  });
}
