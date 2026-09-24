import { RefreshCw } from "lucide-react";

export default function Loading() {
  return (
    <main className="shell">
      <section className="workspace" aria-busy="true" aria-label="正在加载额度数据">
        <div className="accountsList" aria-hidden="true">
          {[0, 1].map((index) => (
            <div className="accountGroup" key={index}>
              <div className="loadingLine loadingAccountName" />
              <div className="usageGrid">
                <div className="loadingCard" />
                <div className="loadingCard" />
              </div>
            </div>
          ))}
        </div>
        <div className="floatingRefresh">
          <button className="refreshButton" type="button" disabled>
            <RefreshCw aria-hidden="true" className="spin" size={16} />
            <span>正在查询</span>
          </button>
        </div>
      </section>
    </main>
  );
}
