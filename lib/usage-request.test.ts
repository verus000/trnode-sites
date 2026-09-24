import { describe, expect, it, vi } from "vitest";

import { requestAccountUsage } from "./usage-request";

const payload = {
  code: 0,
  data: {
    updated_at: "2026-08-13T11:10:23+08:00",
    five_hour: {
      utilization: 2,
      resets_at: "2026-08-13T16:00:00+08:00",
      remaining_seconds: 300,
      window_stats: { requests: 2, tokens: 20, cost: 1, standard_cost: 1, user_cost: 1 },
    },
    seven_day: {
      utilization: 83,
      resets_at: "2026-08-18T08:00:09+08:00",
      remaining_seconds: 420585,
      window_stats: { requests: 3, tokens: 30, cost: 2, standard_cost: 2, user_cost: 2 },
    },
  },
};

describe("requestAccountUsage", () => {
  it.each([4, 14])("使用账号 %i 请求实时额度且不缓存", async (accountId) => {
    let requestedUrl: URL | undefined;
    let requestedInit: RequestInit | undefined;
    const fetcher = vi.fn(async (url: URL, init: RequestInit) => {
      requestedUrl = url;
      requestedInit = init;
      return Response.json(payload);
    });
    const result = await requestAccountUsage({
      accountId,
      apiKey: "test-secret",
      baseUrl: "https://example.com",
      fetcher,
    });

    expect(result.ok).toBe(true);
    if (!requestedUrl || !requestedInit) throw new Error("Expected an upstream request");
    expect(requestedUrl.pathname).toBe(`/api/v1/admin/accounts/${accountId}/usage`);
    expect(requestedUrl.searchParams.get("source")).toBe("active");
    expect(requestedUrl.searchParams.get("force")).toBe("true");
    expect(requestedUrl.searchParams.get("timezone")).toBe("Asia/Shanghai");
    expect(requestedInit.cache).toBe("no-store");
    expect(requestedInit.signal).toBeInstanceOf(AbortSignal);
    expect(new Headers(requestedInit.headers).get("x-api-key")).toBe("test-secret");
  });

  it("returns a safe error for a non-2xx response", async () => {
    const result = await requestAccountUsage({
      accountId: 14,
      apiKey: "test-secret",
      baseUrl: "https://example.com",
      fetcher: async () => new Response(null, { status: 503 }),
    });

    expect(result).toEqual({ ok: false, message: "上游服务暂时无法返回额度数据。" });
  });

  it("returns a safe error for a business failure", async () => {
    const result = await requestAccountUsage({
      accountId: 14,
      apiKey: "test-secret",
      baseUrl: "https://example.com",
      fetcher: async () => Response.json({ code: 401, message: "contains private detail" }),
    });

    expect(result).toEqual({ ok: false, message: "额度数据获取失败，请稍后重试。" });
  });

  it("returns a safe error when the request times out", async () => {
    const result = await requestAccountUsage({
      accountId: 14,
      apiKey: "test-secret",
      baseUrl: "https://example.com",
      fetcher: async () => {
        throw new DOMException("The operation timed out", "TimeoutError");
      },
      timeoutMs: 1,
    });

    expect(result).toEqual({ ok: false, message: "额度数据获取失败，请稍后重试。" });
  });
});
