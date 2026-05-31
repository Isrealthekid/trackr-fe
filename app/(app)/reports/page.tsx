import { Download, FileText, Sparkles, CalendarRange } from "lucide-react";
import { allReports } from "@/data";
import { Badge } from "@/components/StatusDot";
import { PageHeader } from "@/components/PageHeader";

export default function ReportsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Reports"
        subtitle="Generate, schedule, and download fleet reports"
        actions={
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-accent/90 hover:bg-accent text-white text-sm transition">
            <Sparkles className="w-4 h-4" />
            New report
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 mb-6">
        <ReportType label="Fuel" desc="Consumption & refills" />
        <ReportType label="Behaviour" desc="Driver events summary" />
        <ReportType label="Utilization" desc="Hours, distance, idle" />
        <ReportType label="Alerts" desc="Incidents grouped" />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-sm font-semibold">Recent</h2>
        <span className="text-[11px] text-text-muted font-mono">
          {allReports.length} reports
        </span>
      </div>

      <div className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated">
            <tr className="text-[10px] uppercase tracking-[0.08em] text-text-muted">
              <th className="text-left px-4 py-3 font-medium">Report</th>
              <th className="text-left px-4 py-3 font-medium">Type</th>
              <th className="text-left px-4 py-3 font-medium">Scope</th>
              <th className="text-left px-4 py-3 font-medium">Range</th>
              <th className="text-right px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {allReports.map((r) => (
              <tr
                key={r.id}
                className="border-t border-border-subtle hover:bg-white/[0.02] transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-text-muted" />
                    <div>
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-[11px] text-text-muted font-mono">
                        {r.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 capitalize text-text-secondary text-xs">
                  {r.type}
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs">
                  {r.scope}
                </td>
                <td className="px-4 py-3 text-xs text-text-muted font-mono">
                  <span className="inline-flex items-center gap-1">
                    <CalendarRange className="w-3 h-3" />
                    {r.range}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono tabular text-xs">
                  {r.sizeKb} KB
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-border-subtle bg-bg-elevated text-text-secondary hover:border-accent/40 hover:text-accent hover:shadow-[0_0_12px_rgba(59,130,246,0.3)] transition">
                    <Download className="w-3 h-3" />
                    {r.format.toUpperCase()}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportType({ label, desc }: { label: string; desc: string }) {
  return (
    <button className="text-left rounded-xl border border-border-soft bg-bg-surface p-4 hover:border-accent/30 hover:bg-bg-elevated transition">
      <Badge tone="info">{label}</Badge>
      <div className="text-xs text-text-secondary mt-2">{desc}</div>
    </button>
  );
}
