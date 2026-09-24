import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// 额度页面始终实时查询，无需启用持久化缓存或配置 R2。
export default defineCloudflareConfig();
