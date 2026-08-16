import { AlertCircle } from "lucide-react";

import { RefreshButton } from "@/components/refresh-button";
import { UsageWindowCard } from "@/components/usage-window-card";
import { getAccountUsage } from "@/lib/usage";

export const dynamic = "force-dynamic";

export default async function AccountUsagePage() {
  const result = await getAccountUsage();
  const showFiveHour = result.ok && result.data.fiveHour.utilization > 0;

  return (
    <main className="shell">
      <section className="workspace">
        {result.ok ? (
          <>
            <div className={`usageGrid${showFiveHour ? "" : " usageGrid--single"}`}>
              {showFiveHour && (
                <UsageWindowCard
                  title="5 小时额度"
                  description="短时额度"
                  window={result.data.fiveHour}
                />
              )}
              <UsageWindowCard
                title="7 天额度"
                description="周额度"
                window={result.data.sevenDay}
                action={<RefreshButton label="刷新" />}
              />
            </div>
          </>
        ) : (
          <>
            <section className="errorState" role="alert">
              <span className="errorIcon"><AlertCircle aria-hidden="true" size={22} /></span>
              <div>
                <h2>暂时无法获取额度</h2>
                <p>{result.message}</p>
              </div>
            </section>
            <div className="errorActions">
              <RefreshButton label="重新尝试" />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
