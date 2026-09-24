import { AlertCircle } from "lucide-react";

import type { AccountUsage } from "@/lib/usage-types";
import { UsageWindowCard } from "./usage-window-card";

const statusLabels = new Map([
  ["active", "正常"],
  ["inactive", "已停用"],
  ["error", "异常"],
]);

export function AccountUsageGroup({ account, usage }: AccountUsage) {
  const statusTone =
    account.status === "active" ? "active" : account.status === "error" ? "error" : "neutral";

  return (
    <section className="accountGroup" aria-labelledby={`account-${account.id}`}>
      <header className="accountHeading">
        <h2 id={`account-${account.id}`}>{account.name || `账号 #${account.id}`}</h2>
        <div className="accountBadges">
          <span className="platformBadge">
            {account.platform === "openai" ? "OpenAI" : account.platform || "未知平台"}
          </span>
          <span className={`statusBadge statusBadge--${statusTone}`}>
            {statusLabels.get(account.status) ?? (account.status || "未知状态")}
          </span>
        </div>
      </header>

      {usage.ok ? (
        <div
          key={`${account.id}:${usage.data.updatedAt}`}
          className="usageGrid"
        >
          <UsageWindowCard title="5 小时额度" description="短时额度" window={usage.data.fiveHour} />
          <UsageWindowCard title="7 天额度" description="周额度" window={usage.data.sevenDay} />
        </div>
      ) : (
        <div className="errorState accountError" role="alert">
          <span className="errorIcon"><AlertCircle aria-hidden="true" size={22} /></span>
          <div>
            <h3>暂时无法获取额度</h3>
            <p>{usage.message}</p>
          </div>
        </div>
      )}
    </section>
  );
}
