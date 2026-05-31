import Link from "next/link";
import { Plus, Truck } from "lucide-react";
import { allVehicles, relativeTime, statusLabel } from "@/data";
import { Badge, StatusDot } from "@/components/StatusDot";
import { PageHeader } from "@/components/PageHeader";

export default function VehiclesPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Vehicles"
        subtitle={`${allVehicles.length} vehicles registered to your organization`}
        actions={
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-accent/90 hover:bg-accent text-white text-sm transition">
            <Plus className="w-4 h-4" />
            Register vehicle
          </button>
        }
      />

      <div className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-bg-elevated text-[10px] uppercase tracking-[0.08em] text-text-muted">
              <th className="text-left px-4 py-3 font-medium">Vehicle</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-left px-4 py-3 font-medium">Driver</th>
              <th className="text-left px-4 py-3 font-medium">Location</th>
              <th className="text-right px-4 py-3 font-medium">Speed</th>
              <th className="text-right px-4 py-3 font-medium">Fuel</th>
              <th className="text-right px-4 py-3 font-medium">Last seen</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {allVehicles.map((v) => (
              <tr
                key={v.id}
                className="border-t border-border-subtle hover:bg-white/[0.02] transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-center">
                      <Truck className="w-4 h-4 text-text-muted" />
                    </div>
                    <div>
                      <div className="font-medium">{v.nickname}</div>
                      <div className="text-[11px] text-text-muted font-mono">
                        {v.plate} · {v.make} {v.model}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
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
                </td>
                <td className="px-4 py-3 text-text-secondary">{v.driver}</td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  {v.address}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular">
                  {v.speed}{" "}
                  <span className="text-text-muted text-[10px]">km/h</span>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular">
                  {v.fuel}%
                </td>
                <td className="px-4 py-3 text-right text-xs text-text-muted font-mono">
                  {relativeTime(v.lastSeen)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/vehicles/${v.id}`}
                    className="text-xs px-2.5 py-1 rounded-md border border-border-subtle bg-bg-elevated text-text-secondary hover:border-accent/40 hover:text-accent hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
