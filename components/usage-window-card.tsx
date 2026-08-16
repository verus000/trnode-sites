import { CalendarClock, CircleDollarSign, Gauge, Hash, Zap } from "lucide-react";
import type { ReactNode } from "react";

import { formatShanghaiDateTime } from "@/lib/date-format";
import { formatTokens } from "@/lib/number-format";
import type { UsageWindow } from "@/lib/usage-types";
import { Countdown } from "./countdown";

const integerFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});
function getUsageTone(utilization: number): "normal" | "warning" | "critical" {
  if (utilization >= 90) return "critical";
  if (utilization >= 70) return "warning";
  return "normal";
}

export function UsageWindowCard({
  title,
  description,
  window,
  action,
}: {
  title: string;
  description: string;
  window: UsageWindow;
  action?: ReactNode;
}) {
  const tone = getUsageTone(window.utilization);
  const progress = Math.min(100, Math.max(0, window.utilization));

  return (
    <article className="usageCard">
      <div className="cardHeading">
        <div>
          <p className="eyebrow">{description}</p>
          <h2>{title}</h2>
        </div>
        <div className={`utilization utilization--${tone}`}>
          <strong>{integerFormatter.format(window.utilization)}%</strong>
          <span>已使用</span>
        </div>
      </div>

      <div
        aria-label={`额度已使用 ${window.utilization}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progress}
        className="progressTrack"
        role="progressbar"
      >
        <span className={`progressBar progressBar--${tone}`} style={{ width: `${progress}%` }} />
      </div>

      <div className="resetRow">
        <CalendarClock aria-hidden="true" size={18} />
        <div>
          <span className="metricLabel">距离重置</span>
          <strong><Countdown initialSeconds={window.remainingSeconds} /></strong>
        </div>
        <time dateTime={window.resetsAt}>{formatShanghaiDateTime(window.resetsAt)}</time>
      </div>

      <div className="metricGrid">
        <div className="metric">
          <Hash aria-hidden="true" size={16} />
          <span className="metricLabel">请求数</span>
          <strong>{integerFormatter.format(window.stats.requests)}</strong>
        </div>
        <div className="metric">
          <Zap aria-hidden="true" size={16} />
          <span className="metricLabel">Token</span>
          <strong title={integerFormatter.format(window.stats.tokens)}>{formatTokens(window.stats.tokens)}</strong>
        </div>
        <div className="metric">
          <CircleDollarSign aria-hidden="true" size={16} />
          <span className="metricLabel">实际成本</span>
          <strong>{currencyFormatter.format(window.stats.cost)}</strong>
        </div>
      </div>

      <div className="costBreakdown">
        <div>
          <span>标准成本</span>
          <strong>{currencyFormatter.format(window.stats.standardCost)}</strong>
        </div>
        <div>
          <span>用户成本</span>
          <strong>{currencyFormatter.format(window.stats.userCost)}</strong>
        </div>
        <div className="cardAction">{action ?? <Gauge aria-hidden="true" size={17} />}</div>
      </div>
    </article>
  );
}
