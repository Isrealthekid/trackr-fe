import { Download, FileText } from "lucide-react";
import { allTrips } from "@/data";
import { Badge } from "@/components/StatusDot";
import { PageHeader } from "@/components/PageHeader";

export default function TripsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Trips"
        subtitle="Fleet-wide trip log. Click any row to view route playback."
        actions={
          <>
            <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-bg-elevated border border-border-soft text-sm text-text-secondary hover:border-accent/30 transition">
              <FileText className="w-4 h-4" /> Export PDF
            </button>
            <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-bg-elevated border border-border-soft text-sm text-text-secondary hover:border-accent/30 transition">
              <Download className="w-4 h-4" /> Export XLSX
            </button>
          </>
        }
      />

      <div className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated">
            <tr className="text-[10px] uppercase tracking-[0.08em] text-text-muted">
              <th className="text-left px-4 py-3 font-medium">Trip ID</th>
              <th className="text-left px-4 py-3 font-medium">Vehicle</th>
              <th className="text-left px-4 py-3 font-medium">Driver</th>
              <th className="text-left px-4 py-3 font-medium">Route</th>
              <th className="text-right px-4 py-3 font-medium">Distance</th>
              <th className="text-right px-4 py-3 font-medium">Duration</th>
              <th className="text-right px-4 py-3 font-medium">Max speed</th>
              <th className="text-right px-4 py-3 font-medium">Delay</th>
              <th className="text-right px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {allTrips.map((t) => (
              <tr
                key={t.id}
                className="border-t border-border-subtle hover:bg-white/[0.02] transition cursor-pointer"
              >
                <td className="px-4 py-3 font-mono text-[11px] text-text-muted">
                  {t.id}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{t.vehiclePlate}</td>
                <td className="px-4 py-3 text-text-secondary">{t.driver}</td>
                <td className="px-4 py-3">
                  <div className="text-sm">{t.origin}</div>
                  <div className="text-[11px] text-text-muted">
                    → {t.destination}
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular">
                  {t.distanceKm} km
                </td>
                <td className="px-4 py-3 text-right font-mono tabular">
                  {Math.floor(t.durationMin / 60)}h {t.durationMin % 60}m
                </td>
                <td className="px-4 py-3 text-right font-mono tabular">
                  {t.maxSpeed}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular">
                  <span
                    className={
                      t.delay > 10
                        ? "text-[#f59e0b]"
                        : t.delay < 0
                        ? "text-status-success"
                        : "text-text-muted"
                    }
                  >
                    {t.delay > 0 ? `+${t.delay}` : t.delay}m
                  </span>
                </td>
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
    </div>
  );
}
