"use client";

import dynamic from "next/dynamic";
import { Plus, Pencil, Power } from "lucide-react";
import { allGeofences } from "@/data";
import { Badge } from "@/components/StatusDot";
import { PageHeader } from "@/components/PageHeader";

const LiveMap = dynamic(
  () => import("@/components/LiveMap").then((m) => m.LiveMap),
  { ssr: false }
);

export default function GeofencesPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Geofences"
        subtitle="Draw zones; alert on entry, exit, or both."
        actions={
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-accent/90 hover:bg-accent text-white text-sm transition">
            <Plus className="w-4 h-4" />
            New geofence
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-border-soft bg-bg-surface p-4">
          <h3 className="text-sm font-semibold mb-3">Zone map</h3>
          <div className="h-[520px]">
            <LiveMap
              vehicles={[]}
              showPolygons={allGeofences.map((g) => ({
                id: g.id,
                color: g.color,
                polygon: g.polygon,
              }))}
              focusBounds={allGeofences.flatMap((g) => g.polygon)}
            />
          </div>
        </div>

        <div className="space-y-2">
          {allGeofences.map((g) => (
            <div
              key={g.id}
              className="rounded-xl border border-border-soft bg-bg-surface p-4"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: g.color }}
                  />
                  <div className="text-sm font-medium">{g.name}</div>
                </div>
                <div className="flex gap-1">
                  <button className="w-7 h-7 rounded-md hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition flex items-center justify-center">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-md hover:bg-white/[0.06] text-text-muted hover:text-text-primary transition flex items-center justify-center">
                    <Power className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-text-muted font-mono">
                {g.id}
              </div>
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                <Badge tone={g.enabled ? "success" : "neutral"}>
                  {g.enabled ? "Enabled" : "Disabled"}
                </Badge>
                <Badge tone="info">{g.rule}</Badge>
              </div>
              <div className="mt-3 text-[11px] text-text-secondary space-y-0.5">
                <div>
                  <span className="text-text-muted">Applies to:</span>{" "}
                  {g.appliesTo}
                </div>
                <div>
                  <span className="text-text-muted">Active:</span>{" "}
                  {g.activeHours}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
