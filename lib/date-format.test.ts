import { describe, expect, it } from "vitest";

import { formatShanghaiDateTime } from "./date-format";

describe("formatShanghaiDateTime", () => {
  it("formats the reset date in the fixed Chinese layout", () => {
    expect(formatShanghaiDateTime("2026-08-20T11:35:00+08:00")).toBe(
      "2026年08月20日 周四 11:35",
    );
  });

  it("converts other offsets to Asia/Shanghai", () => {
    expect(formatShanghaiDateTime("2026-08-20T03:35:00Z")).toBe(
      "2026年08月20日 周四 11:35",
    );
  });
});
