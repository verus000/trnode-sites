import { parseUsageResponse } from "./usage-parser";
import type { UsageResult } from "./usage-types";

export const DEFAULT_REQUEST_TIMEOUT_MS = 12_000;

export type UsageFetch = (url: URL, init: RequestInit) => Promise<Response>;

export async function requestAccountUsage({
  accountId,
  apiKey,
  baseUrl,
  fetcher = fetch,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
}: {
  accountId: number;
  apiKey: string;
  baseUrl: string;
  fetcher?: UsageFetch;
  timeoutMs?: number;
}): Promise<UsageResult> {
  try {
    const url = new URL(`/api/v1/admin/accounts/${accountId}/usage`, baseUrl);
    url.searchParams.set("source", "active");
    url.searchParams.set("force", "true");
    url.searchParams.set("timezone", "Asia/Shanghai");

    const response = await fetcher(url, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36",
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      return { ok: false, message: "上游服务暂时无法返回额度数据。" };
    }

    return { ok: true, data: parseUsageResponse(await response.json()) };
  } catch {
    return { ok: false, message: "额度数据获取失败，请稍后重试。" };
  }
}
