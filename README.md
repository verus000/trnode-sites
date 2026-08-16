# TRNode Tools

An extensible Next.js tool surface. The first module exposes account usage at
`/account-usage` and keeps the upstream admin credential on the server.

## Run

1. Configure `.env` from `.env.example`.
2. Run `docker compose up -d --build`.
3. Proxy `/account-usage` to `http://127.0.0.1:1234` without stripping the path.

The container port is intentionally bound to the host loopback interface only.
