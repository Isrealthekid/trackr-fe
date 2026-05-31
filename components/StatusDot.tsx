import type { VehicleStatus } from "@/data";
import { statusColor, statusLabel } from "@/data";

export function StatusDot({
  status,
  showLabel = false,
}: {
  status: VehicleStatus;
  showLabel?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full"
        style={{
          background: statusColor(status),
          boxShadow:
            status === "moving"
              ? `0 0 8px ${statusColor(status)}`
              : status === "alert"
              ? `0 0 8px ${statusColor(status)}`
              : "none",
        }}
        aria-label={statusLabel(status)}
      />
      {showLabel && (
        <span className="text-xs text-text-secondary">
          {statusLabel(status)}
        </span>
      )}
    </span>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "online" | "offline" | "warning" | "info" | "success";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral:
      "bg-bg-surface-2 border-border-soft text-text-secondary",
    online:
      "bg-[rgba(34,197,94,0.12)] border-[rgba(34,197,94,0.35)] text-[#22c55e]",
    offline:
      "bg-[rgba(239,68,68,0.12)] border-[rgba(239,68,68,0.30)] text-[#ef4444]",
    warning:
      "bg-[rgba(245,158,11,0.12)] border-[rgba(245,158,11,0.30)] text-[#f59e0b]",
    info: "bg-[rgba(59,130,246,0.12)] border-[rgba(59,130,246,0.30)] text-[#3b82f6]",
    success:
      "bg-[rgba(16,185,129,0.12)] border-[rgba(16,185,129,0.30)] text-[#10b981]",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-mono text-[10px] uppercase tracking-[0.08em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
