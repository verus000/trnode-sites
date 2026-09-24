import { AlertCircle, Users } from "lucide-react";

import { AccountUsageGroup } from "@/components/account-usage-group";
import { RefreshButton } from "@/components/refresh-button";
import { getAccountsUsage } from "@/lib/usage";

export const dynamic = "force-dynamic";

export default async function AccountUsagePage() {
  const result = await getAccountsUsage();

  return (
    <main className="shell">
      <section className="workspace">
        {!result.ok ? (
          <section className="errorState" role="alert">
            <span className="errorIcon"><AlertCircle aria-hidden="true" size={22} /></span>
            <div>
              <h2>暂时无法获取账号列表</h2>
              <p>{result.message}</p>
            </div>
          </section>
        ) : result.data.length === 0 ? (
          <section className="emptyState" role="status">
            <Users aria-hidden="true" size={30} />
            <h2>暂无账号</h2>
            <p>添加账号后，点击“重新查询”查看额度。</p>
          </section>
        ) : (
          <div className="accountsList">
            {result.data.map((entry) => (
              <AccountUsageGroup key={entry.account.id} account={entry.account} usage={entry.usage} />
            ))}
          </div>
        )}

        <div className="floatingRefresh">
          <RefreshButton label="重新查询" />
        </div>
      </section>
    </main>
  );
}
