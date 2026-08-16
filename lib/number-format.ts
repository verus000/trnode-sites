const integerFormatter = new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 0 });
const millionFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatTokens(value: number): string {
  if (Math.abs(value) >= 1_000_000) {
    return `${millionFormatter.format(value / 1_000_000)}M`;
  }

  return integerFormatter.format(value);
}
