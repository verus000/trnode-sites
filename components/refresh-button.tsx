"use client";

import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function RefreshButton({
  compact = false,
  label = "重新查询",
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
      title={compact ? (isPending ? "正在查询" : label) : undefined}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw aria-hidden="true" className={isPending ? "spin" : undefined} size={16} />
      {!compact && <span>{isPending ? "正在查询" : label}</span>}
    </button>
  );
}
