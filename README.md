# TRNode Tools

基于 Next.js 的工具台，当前在 `/account-usage` 提供多账号额度看板。

页面自动读取全部分页，按账号名称升序分组展示额度，最多同时请求 4 个账号。
点击右下角悬浮的“重新查询”可同步账号增删与最新额度；单个账号请求失败时，其余账号仍正常展示。
5 小时和 7 天额度始终显示，使用率为 0 时也保留卡片。

沿用服务端的 `UPSTREAM_API_KEY` 和 `UPSTREAM_BASE_URL` 配置，管理凭据及上游账号
敏感字段不会传给浏览器。

## Cloudflare Workers 仓库部署

使用 OpenNext 将 Next.js 构建产物适配为 Worker，保留服务端实时查询和 `/account-usage` 路径。
项目固定使用 Node.js 24.17.0 和 pnpm 11.8.0，不需要配置 R2、KV 或数据库。

在 Cloudflare 的 **Workers & Pages → Create application → Import a repository** 中选择仓库，设置：

| 设置 | 值 |
| --- | --- |
| 仓库 | `verus000/trnode-sites` |
| 生产分支 | `main` |
| Worker 名称 | `trnode-tools`，与 `wrangler.jsonc` 中的 `name` 一致 |
| 根目录 | 仓库根目录 |
| 构建命令 | `pnpm run build:worker` |
| 部署命令 | `pnpm run deploy:worker` |

在构建环境变量中设置 `NODE_VERSION=24.17.0` 和 `PNPM_VERSION=11.8.0`，与仓库固定版本保持一致。

Worker 创建后，在 **Settings → Variables & Secrets** 中新增 Secret：

| 名称 | 类型 | 值 |
| --- | --- | --- |
| `UPSTREAM_API_KEY` | Secret | 自行填写上游管理员 API Key |

`UPSTREAM_BASE_URL` 已在 `wrangler.jsonc` 中配置为 `https://ai.trnode.top`。
如需更换上游地址，修改此配置并重新部署。`keep_vars` 会保留后台新增、未在配置文件中声明的变量。

密钥需要配置在 Worker 的**运行时**设置中。当前页面不在构建阶段请求额度，不需要将管理员密钥添加到 **Build variables and secrets**。
首次部署未填写密钥时，页面会提示尚未配置访问凭据；保存 Secret 后重新查询即可。

访问 Cloudflare 分配域名下的 `/account-usage`，例如 `https://trnode-tools.<你的子域>.workers.dev/account-usage`。
后续推送到 `main` 会自动构建并部署。构建及部署命令已经拆开，不会重复执行 Next.js 构建。

## 本地开发与 Workers 预览

从 `.env.example` 创建本地 `.env` 并自行填写凭据，然后执行：

```sh
eval "$(fnm env --shell zsh)"
fnm use --install-if-missing
pnpm install
pnpm dev
```

需要在 Workers 运行时预览时，从 `.dev.vars.example` 创建 `.dev.vars`，在同一 Node.js 会话中执行：

```sh
pnpm run build:worker
pnpm run preview:worker
```

本地开发和预览均访问服务启动地址下的 `/account-usage`。修改 Workers 绑定后，可以执行 `pnpm run cf-typegen` 重新生成环境类型。
`.env`、`.dev.vars`、Workers 构建产物和生成的环境类型不会提交到仓库。

## 原有 Docker 部署

原有 Docker 配置保留，容器端口只绑定宿主机回环地址 `127.0.0.1:1234`。
反向代理需将 `/account-usage` 转发到容器并保留路径。
当前 Dockerfile 仍引用仓库未提供的 `package-lock.json`，属于既有问题，本次 Workers 适配未修改。
