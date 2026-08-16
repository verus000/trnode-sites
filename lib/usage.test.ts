import { describe, expect, it } from "vitest";

import { parseUsageResponse } from "./usage-parser";

const validPayload = {
  code: 0,
  message: "success",
  data: {
    updated_at: "2026-08-13T11:10:23+08:00",
    five_hour: {
      utilization: 0,
      resets_at: "2026-08-13T11:10:23+08:00",
      remaining_seconds: 0,
      window_stats: {
        requests: 17,
        tokens: 439749,
        cost: 0.4067566,
        standard_cost: 0.4067566,
        user_cost: 0.4067566,
      },
    },
    seven_day: {
      utilization: 83,
      resets_at: "2026-08-18T08:00:09+08:00",
      remaining_seconds: 420585,
      window_stats: {
        requests: 1294,
        tokens: 73100501,
        cost: 112.92087243,
        standard_cost: 112.92087243,
        user_cost: 112.92087243,
      },
    },
  },
};

describe("parseUsageResponse", () => {
  it("maps a valid upstream payload", () => {
    const parsed = parseUsageResponse(validPayload);
    expect(parsed.sevenDay.utilization).toBe(83);
    expect(parsed.sevenDay.stats.tokens).toBe(73100501);
    expect(parsed.fiveHour.stats.requests).toBe(17);
  });

  it("rejects a non-zero business code", () => {
    expect(() => parseUsageResponse({ ...validPayload, code: 401 })).toThrow("business error");
  });

  it("rejects a missing window", () => {
    const { seven_day: _omitted, ...incompleteData } = validPayload.data;
    const payload = { ...validPayload, data: incompleteData };
    expect(() => parseUsageResponse(payload)).toThrow("Invalid usage window");
  });

  it("rejects non-finite numeric fields", () => {
    const payload = structuredClone(validPayload);
    payload.data.five_hour.utilization = Number.NaN;
    expect(() => parseUsageResponse(payload)).toThrow("Invalid number field");
  });
});
