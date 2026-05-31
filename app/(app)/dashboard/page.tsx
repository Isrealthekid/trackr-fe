"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Search, Filter, X } from "lucide-react";
import {
  allVehicles,
  relativeTime,
  statusColor,
  statusLabel,
  type VehicleStatus,
} from "@/data";
import { StatusDot, Badge } from "@/components/StatusDot";

const LiveMap = dynamic(
  () => import("@/components/LiveMap").then((m) => m.LiveMap),
  { ssr: false }
);

const FILTERS: { id: VehicleStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "moving", label: "Moving" },
  { id: "idle", label: "Idle" },
  { id: "parked", label: "Parked" },
  { id: "alert", label: "Alerting" },
];

export default function DashboardPage() {
  const [filter, setFilter] = useState<VehicleStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return allVehicles.filter((v) => {
      const matchesFilter = filter === "all" || v.status === filter;
      const matchesQuery =
        !query ||
        v.plate.toLowerCase().includes(query.toLowerCase()) ||
        v.driver.toLowerCase().includes(query.toLowerCase()) ||
        v.nickname.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const selected = selectedId
    ? allVehicles.find((v) => v.id === selectedId) ?? null
    : null;

  const counts = useMemo(() => {
    const c = { moving: 0, idle: 0, parked: 0, alert: 0 };
    allVehicles.forEach((v) => c[v.status]++);
    return c;
  }, []);

  return (
    <div className="h-full flex">
      {/* Vehicles overlay panel */}
      <aside className="w-[340px] shrink-0 flex flex-col bg-bg-surface border-r border-border-subtle">
        <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold">Live Fleet</h2>
              <p className="text-[11px] text-text-muted font-mono tabular">
                {allVehicles.length} vehicles · {counts.moving} moving ·{" "}
                {counts.alert} alerting
              </p>
            </div>
            <button className="w-8 h-8 rounded-md bg-bg-elevated border border-border-subtle hover:border-accent/30 transition">
              <Filter className="w-3.5 h-3.5 text-text-secondary mx-auto" />
            </button>
          </div>

          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Plate, driver, nickname…"
              className="w-full h-9 pl-8 pr-3 rounded-md bg-bg-elevated border border-border-subtle text-sm placeholder:text-text-muted focus:border-accent/50 outline-none transition"
            />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${
                  filter === f.id
                    ? "bg-accent/15 border-accent/40 text-text-primary"
                    : "bg-bg-elevated border-border-subtle text-text-secondary hover:border-accent/25"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-3 py-2 space-y-1.5">
          {filtered.length === 0 && (
            <div className="text-center py-10 text-xs text-text-muted">
              No vehicles match these filters.
            </div>
          )}
          {filtered.map((v) => {
            const active = v.id === selectedId;
            return (
              <button
                key={v.id}
                onClick={() => setSelectedId(v.id)}
                className={`w-full text-left rounded-lg p-3 border transition ${
                  active
                    ? "bg-accent/[0.06] border-accent/40"
                    : "bg-bg-surface border-border-subtle hover:bg-bg-elevated hover:border-accent/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] text-text-muted">
                    {v.id}
                  </span>
                  <Badge
                    tone={
                      v.status === "moving"
                        ? "online"
                        : v.status === "alert"
                        ? "offline"
                        : v.status === "idle"
                        ? "warning"
                        : "neutral"
                    }
                  >
                    <StatusDot status={v.status} /> {statusLabel(v.status)}
                  </Badge>
                </div>
                <div className="text-sm font-medium">
                  {v.nickname}{" "}
                  <span className="text-text-muted font-mono text-xs">
                    {v.plate}
                  </span>
                </div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {v.driver}
                </div>
                <div className="flex items-center justify-between mt-2 text-[11px] font-mono tabular text-text-muted">
                  <span>{v.speed} km/h</span>
                  <span>{v.fuel}% fuel</span>
                  <span>{relativeTime(v.lastSeen)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Map area */}
      <div className="flex-1 relative p-4 min-w-0">
        <div className="absolute top-7 left-7 z-[400] flex gap-2">
          <KpiPill label="Online" value={counts.moving} color="var(--status-online)" />
          <KpiPill label="Idle" value={counts.idle} color="var(--status-transit)" />
          <KpiPill label="Parked" value={counts.parked} color="var(--status-idle)" />
          <KpiPill label="Alerts" value={counts.alert} color="var(--status-danger)" />
        </div>

        <LiveMap
          vehicles={allVehicles}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* Quick panel */}
        {selected && (
          <div className="absolute top-4 right-4 w-[300px] z-[400] glass-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] font-mono text-text-muted">
                  {selected.id}
                </div>
                <div className="text-sm font-semibold mt-1">
                  {selected.nickname}
                </div>
                <div className="text-xs text-text-secondary font-mono">
                  {selected.plate}
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="w-7 h-7 rounded-md hover:bg-white/[0.06] transition"
              >
                <X className="w-3.5 h-3.5 text-text-muted mx-auto" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: statusColor(selected.status) }}
              />
              <span className="text-xs">{statusLabel(selected.status)}</span>
              <span className="ml-auto text-[11px] text-text-muted font-mono">
                {relativeTime(selected.lastSeen)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              <Metric label="Speed" value={`${selected.speed}`} unit="km/h" />
              <Metric label="Fuel" value={`${selected.fuel}`} unit="%" />
              <Metric label="Engine hrs" value={`${selected.engineHours}`} />
              <Metric label="Battery" value={`${selected.battery}`} unit="V" />
            </div>

            <div className="text-[11px] text-text-secondary mt-3">
              <div className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">
                Location
              </div>
              {selected.address}
            </div>
            <div className="text-[11px] text-text-secondary mt-2">
              <div className="text-text-muted text-[10px] uppercase tracking-wider mb-0.5">
                Driver
              </div>
              {selected.driver}
            </div>

            <a
              href={`/vehicles/${selected.id}`}
              className="block mt-4 text-center h-9 leading-9 rounded-md bg-accent/90 hover:bg-accent text-white text-xs font-medium transition"
            >
              View vehicle detail
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="glass-card !rounded-full px-3 py-1.5 flex items-center gap-2">
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <span className="text-sm font-mono tabular font-semibold">{value}</span>
    </div>
  );
}

function Metric({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="bg-bg-surface-2 border border-border-subtle rounded-lg px-2.5 py-2">
      <div className="text-[10px] text-text-muted uppercase tracking-wider">
        {label}
      </div>
      <div className="text-sm font-mono tabular mt-0.5">
        {value}
        {unit && (
          <span className="text-text-muted text-[11px] ml-1">{unit}</span>
        )}
      </div>
    </div>
  );
}
