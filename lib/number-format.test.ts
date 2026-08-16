import { describe, expect, it } from "vitest";

import { formatTokens } from "./number-format";

describe("formatTokens", () => {
  it("uses M for token values of at least one million", () => {
    expect(formatTokens(9_855_300)).toBe("9.86M");
    expect(formatTokens(73_100_501)).toBe("73.1M");
  });

  it("keeps smaller values as grouped integers", () => {
    expect(formatTokens(439_749)).toBe("439,749");
  });
});
