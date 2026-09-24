import "server-only";

import { requestAccounts } from "./accounts-request";
import { requestAccountUsage } from "./usage-request";
import type { AccountUsage, AccountsUsageResult } from "./usage-types";

const MAX_CONCURRENT_USAGE_REQUESTS = 4;

export async function getAccountsUsage(): Promise<AccountsUsageResult> {
  const apiKey = process.env.UPSTREAM_API_KEY;
  if (!apiKey) {
    return { ok: false, message: "服务端尚未配置访问凭据。" };
  }

  const config = {
    apiKey,
    baseUrl: process.env.UPSTREAM_BASE_URL ?? "https://gpt.trnode.top",
  };
  const accounts = await requestAccounts(config);
  if (!accounts.ok) return accounts;

  const accountList = accounts.data;
  const data: AccountUsage[] = new Array(accountList.length);
  let nextIndex = 0;

  async function loadNextAccounts() {
    while (nextIndex < accountList.length) {
      // 在等待请求前领取索引，限制并发且保持账号列表原有顺序。
      const index = nextIndex++;
      const account = accountList[index];
      const usage = await requestAccountUsage({ ...config, accountId: account.id });
      data[index] = { account, usage };
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(MAX_CONCURRENT_USAGE_REQUESTS, accountList.length) },
      () => loadNextAccounts(),
    ),
  );

  return { ok: true, data };
}
