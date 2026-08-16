const shanghaiDateTimeFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function formatShanghaiDateTime(value: string | Date): string {
  const parts = Object.fromEntries(
    shanghaiDateTimeFormatter
      .formatToParts(new Date(value))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${parts.year}年${parts.month}月${parts.day}日 ${parts.weekday} ${parts.hour}:${parts.minute}`;
}
