"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshButton({
  compact = false,
  label = "刷新数据",
}: {
  compact?: boolean;
  label?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      aria-label={compact ? label : undefined}
      className={`refreshButton${compact ? " refreshButton--compact" : ""}`}
      type="button"
      disabled={isPending}
      title={compact ? (isPending ? "正在刷新" : label) : undefined}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw aria-hidden="true" className={isPending ? "spin" : undefined} size={16} />
      {!compact && <span>{isPending ? "正在刷新" : label}</span>}
    </button>
  );
}
