"use client";

import { useEffect, useState } from "react";

function formatRemaining(totalSeconds: number): string {
  if (totalSeconds <= 0) return "即将重置";

  const days = Math.floor(totalSeconds / 86_400);
  const hours = Math.floor((totalSeconds % 86_400) / 3_600);
  const minutes = Math.floor((totalSeconds % 3_600) / 60);

  if (days > 0) return `${days} 天 ${hours} 小时`;
  if (hours > 0) return `${hours} 小时 ${minutes} 分钟`;
  return `${Math.max(1, minutes)} 分钟`;
}

export function Countdown({ initialSeconds }: { initialSeconds: number }) {
  const [remaining, setRemaining] = useState(Math.max(0, initialSeconds));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setRemaining((current) => Math.max(0, current - 60));
    }, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  return <span>{formatRemaining(remaining)}</span>;
}
