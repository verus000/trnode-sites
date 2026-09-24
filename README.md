# TRNode Tools

基于 Next.js 的工具台，当前在 `/account-usage` 提供多账号额度看板。

页面自动读取全部分页，按账号名称升序分组展示额度，最多同时请求 4 个账号。
点击右下角悬浮的“重新查询”可同步账号增删与最新额度；单个账号请求失败时，其余账号仍正常展示。
5 小时和 7 天额度始终显示，使用率为 0 时也保留卡片。

沿用服务端的 `UPSTREAM_API_KEY` 和 `UPSTREAM_BASE_URL` 配置，管理凭据及上游账号
敏感字段不会传给浏览器。

## Run

1. Configure `.env` from `.env.example`.
2. Run `docker compose up -d --build`.
3. Proxy `/account-usage` to `http://127.0.0.1:1234` without stripping the path.

The container port is intentionally bound to the host loopback interface only.
