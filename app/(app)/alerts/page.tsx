"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  ShieldAlert,
  Info,
} from "lucide-react";
import { allAlerts, relativeTime, type AlertSeverity } from "@/data";
import { Badge } from "@/components/StatusDot";
import { PageHeader } from "@/components/PageHeader";

const FILTERS: { id: AlertSeverity | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "warning", label: "Warning" },
  { id: "info", label: "Info" },
];

export default function AlertsPage() {
  const [filter, setFilter] = useState<AlertSeverity | "all">("all");

  const filtered = useMemo(
    () =>
      filter === "all"
        ? allAlerts
        : allAlerts.filter((a) => a.severity === filter),
    [filter]
  );

  const newCount = allAlerts.filter((a) => a.state === "new").length;

  return (
    <div className="p-6">
      <PageHeader
        title="Alerts"
        subtitle={`${newCount} new · ${allAlerts.length} total in the last 24h`}
      />

      {/* Banner for critical unread */}
      {newCount > 0 && (
        <div
          className="rounded-xl border bg-[rgba(239,68,68,0.06)] p-3 mb-5 flex items-center gap-3"
          style={{ borderColor: "rgba(239,68,68,0.30)" }}
        >
          <ShieldAlert className="w-5 h-5 text-[#ef4444]" />
          <div className="flex-1">
            <div className="text-sm font-medium">
              {newCount} unacknowledged alert{newCount === 1 ? "" : "s"}
            </div>
            <div className="text-xs text-text-secondary">
              Review and acknowledge to stop them paging on-call.
            </div>
          </div>
          <button className="text-xs px-3 h-8 rounded-md bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.30)] text-[#ef4444] hover:bg-[rgba(239,68,68,0.20)] transition">
            Acknowledge all
          </button>
        </div>
      )}

      <div className="flex gap-1.5 mb-4">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition ${
              filter === f.id
                ? "bg-accent/15 border-accent/40 text-text-primary"
                : "bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/25"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((a) => {
          const Icon =
            a.severity === "critical"
              ? ShieldAlert
              : a.severity === "warning"
              ? AlertTriangle
              : Info;
          const color =
            a.severity === "critical"
              ? "#ef4444"
              : a.severity === "warning"
              ? "#f59e0b"
              : "#3b82f6";
          return (
            <div
              key={a.id}
              className="rounded-xl border border-border-soft bg-bg-surface p-4 flex items-start gap-3 hover:bg-bg-elevated transition"
              style={{
                borderLeftWidth: 3,
                borderLeftColor: color,
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${color}1A`, color }}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] text-text-muted">
                    {a.id}
                  </span>
                  <Badge
                    tone={
                      a.severity === "critical"
                        ? "offline"
                        : a.severity === "warning"
                        ? "warning"
                        : "info"
                    }
                  >
                    {a.severity}
                  </Badge>
                  <Badge
                    tone={
                      a.state === "new"
                        ? "offline"
                        : a.state === "acknowledged"
                        ? "warning"
                        : "success"
                    }
                  >
                    {a.state}
                  </Badge>
                  <span className="ml-auto text-[11px] text-text-muted font-mono">
                    {relativeTime(a.time)}
                  </span>
                </div>
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {a.message}
                </div>
                <div className="text-[11px] text-text-muted mt-2 flex gap-3 font-mono">
                  <span>{a.vehiclePlate}</span>
                  <span>·</span>
                  <span>{a.driver}</span>
                  <span>·</span>
                  <span>{a.location}</span>
                </div>
              </div>

              {a.state === "new" && (
                <button className="flex items-center gap-1.5 text-xs px-2.5 h-8 rounded-md bg-bg-elevated border border-border-soft text-text-secondary hover:border-accent/40 hover:text-accent transition">
                  <Check className="w-3.5 h-3.5" /> Acknowledge
                </button>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-border-soft bg-bg-surface p-10 text-center text-text-muted text-sm">
            <Bell className="w-6 h-6 mx-auto mb-2 opacity-40" />
            No alerts at this severity.
          </div>
        )}
      </div>
    </div>
  );
}
