import { parseAccountsResponse } from "./accounts-parser";
import { DEFAULT_REQUEST_TIMEOUT_MS, type UsageFetch } from "./usage-request";
import type { AccountSummary, AccountsResult } from "./usage-types";

export async function requestAccounts({
  apiKey,
  baseUrl,
  fetcher = fetch,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
}: {
  apiKey: string;
  baseUrl: string;
  fetcher?: UsageFetch;
  timeoutMs?: number;
}): Promise<AccountsResult> {
  try {
    const accounts = new Map<number, AccountSummary>();
    let page = 1;
    let pages = 1;

    do {
      const url = new URL("/api/v1/admin/accounts", baseUrl);
      url.search = new URLSearchParams({
        page: String(page),
        page_size: "20",
        platform: "",
        type: "",
        status: "",
        privacy_mode: "",
        group: "",
        search: "",
        lite: "1",
        include_scheduler_score: "0",
        sort_by: "name",
        sort_order: "asc",
        timezone: "Asia/Shanghai",
      }).toString();

      const response = await fetcher(url, {
        method: "GET",
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
        headers: {
          Accept: "application/json, text/plain, */*",
          "x-api-key": apiKey,
          "X-Admin-UI-Request": "1",
        },
      });

      if (!response.ok) {
        return { ok: false, message: "上游服务暂时无法返回账号列表。" };
      }

      const result = parseAccountsResponse(await response.json());
      if (result.page !== page) {
        throw new Error("Unexpected accounts page");
      }
      for (const account of result.items) {
        accounts.set(account.id, account);
      }
      pages = result.pages;
      page += 1;
    } while (page <= pages);

    return { ok: true, data: [...accounts.values()] };
  } catch {
    return { ok: false, message: "账号列表获取失败，请稍后重试。" };
  }
}
