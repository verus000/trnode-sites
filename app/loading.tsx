export default function Loading() {
  return (
    <main className="shell">
      <section className="workspace" aria-busy="true" aria-label="正在加载额度数据">
        <div className="usageGrid loadingGrid">
          <div className="loadingCard" />
        </div>
      </section>
    </main>
  );
}
