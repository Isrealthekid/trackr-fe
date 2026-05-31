"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import type { Alert, Trip, Vehicle } from "@/data";
import { Badge, StatusDot } from "@/components/StatusDot";
import { relativeTime } from "@/data";

const LiveMap = dynamic(
  () => import("@/components/LiveMap").then((m) => m.LiveMap),
  { ssr: false }
);

type Tab = "overview" | "trips" | "behaviour" | "fuel" | "alerts";

const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "trips", label: "Trips" },
  { id: "behaviour", label: "Behaviour" },
  { id: "fuel", label: "Fuel" },
  { id: "alerts", label: "Alerts" },
];

const speedSeries = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  speed: Math.round(20 + Math.random() * 70),
}));

const fuelSeries = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  fuel: Math.round(95 - i * 2.4 + Math.random() * 4),
}));

const behaviourSeries = [
  { day: "Mon", braking: 2, accel: 1, speed: 0, night: 1 },
  { day: "Tue", braking: 4, accel: 2, speed: 1, night: 0 },
  { day: "Wed", braking: 1, accel: 0, speed: 3, night: 2 },
  { day: "Thu", braking: 3, accel: 2, speed: 2, night: 1 },
  { day: "Fri", braking: 5, accel: 3, speed: 4, night: 3 },
  { day: "Sat", braking: 1, accel: 1, speed: 0, night: 0 },
  { day: "Sun", braking: 0, accel: 0, speed: 0, night: 0 },
];

export function VehicleDetailTabs({
  vehicle,
  trips,
  alerts,
}: {
  vehicle: Vehicle;
  trips: Trip[];
  alerts: Alert[];
}) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      <div className="flex items-center gap-1 mb-4 border-b border-border-subtle">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-sm relative transition ${
              tab === t.id
                ? "text-text-primary"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-accent shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 rounded-xl border border-border-soft bg-bg-surface p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">Live position</h3>
              <span className="text-[11px] font-mono text-text-muted">
                {vehicle.lat.toFixed(4)}, {vehicle.lng.toFixed(4)}
              </span>
            </div>
            <div className="h-[360px]">
              <LiveMap
                vehicles={[vehicle]}
                focusBounds={[[vehicle.lat, vehicle.lng]]}
                markerSize="sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Card title="Speed (24h)">
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={speedSeries}>
                  <defs>
                    <linearGradient id="sp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="speed"
                    type="monotone"
                    stroke="#3b82f6"
                    fill="url(#sp)"
                    strokeWidth={1.5}
                  />
                  <XAxis dataKey="hour" tick={{ fontSize: 9, fill: "#475569" }} tickLine={false} axisLine={false} interval={3} />
                  <Tooltip
                    contentStyle={{
                      background: "#181c22",
                      border: "1px solid #2A2F3A",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Device health">
              <Row label="Online" value={<Badge tone="online">Reporting</Badge>} />
              <Row label="Signal" value="92%" />
              <Row label="Backup battery" value="98%" />
              <Row label="Firmware" value="v1.4.2" />
              <Row label="Tamper" value={<Badge tone="success">Clean</Badge>} />
            </Card>
          </div>
        </div>
      )}

      {tab === "trips" && (
        <div className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-bg-elevated">
              <tr className="text-[10px] uppercase tracking-[0.08em] text-text-muted">
                <th className="text-left px-4 py-3 font-medium">Trip</th>
                <th className="text-left px-4 py-3 font-medium">Route</th>
                <th className="text-right px-4 py-3 font-medium">Distance</th>
                <th className="text-right px-4 py-3 font-medium">Duration</th>
                <th className="text-right px-4 py-3 font-medium">Max speed</th>
                <th className="text-right px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-text-muted text-sm">
                    No trips recorded yet.
                  </td>
                </tr>
              )}
              {trips.map((t) => (
                <tr key={t.id} className="border-t border-border-subtle hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted">{t.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{t.origin}</div>
                    <div className="text-xs text-text-muted">→ {t.destination}</div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono tabular">{t.distanceKm} km</td>
                  <td className="px-4 py-3 text-right font-mono tabular">{t.durationMin}m</td>
                  <td className="px-4 py-3 text-right font-mono tabular">{t.maxSpeed} km/h</td>
                  <td className="px-4 py-3 text-right">
                    <Badge tone={t.status === "completed" ? "success" : "info"}>
                      {t.status === "completed" ? "Completed" : "In Transit"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "behaviour" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Events by day" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={behaviourSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E232C" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "#181c22",
                    border: "1px solid #2A2F3A",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Bar dataKey="braking" stackId="a" fill="#ef4444" radius={[3, 3, 0, 0]} />
                <Bar dataKey="accel" stackId="a" fill="#f59e0b" />
                <Bar dataKey="speed" stackId="a" fill="#a78bfa" />
                <Bar dataKey="night" stackId="a" fill="#22d3ee" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Driver score">
            <div className="text-center py-4">
              <div className="text-5xl font-mono tabular font-semibold text-status-success">
                88
              </div>
              <div className="text-xs text-text-muted uppercase tracking-wider mt-1">
                / 100 this week
              </div>
            </div>
            <Row label="Harsh braking" value="16 events" />
            <Row label="Harsh accel" value="9 events" />
            <Row label="Speeding" value="10 events" />
            <Row label="Night driving" value="7 hrs" />
          </Card>
        </div>
      )}

      {tab === "fuel" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="Fuel level (24h)" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={fuelSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E232C" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={2} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} unit="%" />
                <Tooltip
                  contentStyle={{
                    background: "#181c22",
                    border: "1px solid #2A2F3A",
                    borderRadius: 8,
                    fontSize: 11,
                  }}
                />
                <Line
                  dataKey="fuel"
                  type="monotone"
                  stroke="#22d3ee"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Anomalies">
            <div className="text-xs text-text-secondary mb-3">
              No siphoning detected in the last 7 days.
            </div>
            <Row label="Avg consumption" value="2.4 km/L" />
            <Row label="Tank capacity" value="380 L" />
            <Row label="Refills this week" value="2" />
            <Row label="Drift events" value={<Badge tone="success">0</Badge>} />
          </Card>
        </div>
      )}

      {tab === "alerts" && (
        <div className="space-y-2">
          {alerts.length === 0 && (
            <div className="rounded-xl border border-border-soft bg-bg-surface p-10 text-center text-text-muted text-sm">
              No alerts for this vehicle.
            </div>
          )}
          {alerts.map((a) => (
            <div
              key={a.id}
              className="rounded-xl border border-border-soft bg-bg-surface p-4 flex items-start gap-3"
              style={{
                borderLeftWidth: 3,
                borderLeftColor:
                  a.severity === "critical"
                    ? "#ef4444"
                    : a.severity === "warning"
                    ? "#f59e0b"
                    : "#3b82f6",
              }}
            >
              <div className="flex-1">
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
                  <span className="ml-auto text-[11px] text-text-muted font-mono">
                    {relativeTime(a.time)}
                  </span>
                </div>
                <div className="text-sm font-medium">{a.title}</div>
                <div className="text-xs text-text-secondary mt-0.5">
                  {a.message}
                </div>
                <div className="text-[11px] text-text-muted mt-2 font-mono">
                  {a.location} · State:{" "}
                  <span className="text-text-secondary capitalize">{a.state}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border-soft bg-bg-surface p-4 ${className ?? ""}`}>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-xs">
      <span className="text-text-muted">{label}</span>
      <span className="font-mono tabular text-text-primary">{value}</span>
    </div>
  );
}
