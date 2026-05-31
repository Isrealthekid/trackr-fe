import {
  Cpu,
  Signal,
  Battery,
  AlertTriangle,
  Upload,
} from "lucide-react";
import { allDevices, relativeTime } from "@/data";
import { Badge } from "@/components/StatusDot";
import { PageHeader } from "@/components/PageHeader";

export default function DevicesPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Devices"
        subtitle="Hardware inventory & health"
        actions={
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-bg-elevated border border-border-soft text-sm text-text-secondary hover:border-accent/30 transition">
            <Upload className="w-4 h-4" />
            Push OTA update
          </button>
        }
      />

      <div className="rounded-xl border border-border-soft bg-bg-surface overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-bg-elevated">
            <tr className="text-[10px] uppercase tracking-[0.08em] text-text-muted">
              <th className="text-left px-4 py-3 font-medium">Device</th>
              <th className="text-left px-4 py-3 font-medium">Kind</th>
              <th className="text-left px-4 py-3 font-medium">Vehicle</th>
              <th className="text-left px-4 py-3 font-medium">Online</th>
              <th className="text-right px-4 py-3 font-medium">Signal</th>
              <th className="text-right px-4 py-3 font-medium">Battery</th>
              <th className="text-right px-4 py-3 font-medium">Firmware</th>
              <th className="text-left px-4 py-3 font-medium">Tamper</th>
              <th className="text-right px-4 py-3 font-medium">Last seen</th>
            </tr>
          </thead>
          <tbody>
            {allDevices.map((d) => (
              <tr
                key={d.id}
                className={`border-t border-border-subtle hover:bg-white/[0.02] transition ${
                  d.tamper || !d.online ? "bg-[rgba(239,68,68,0.04)]" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-text-muted" />
                    </div>
                    <div>
                      <div className="font-mono text-xs">{d.serial}</div>
                      <div className="text-[10px] text-text-muted font-mono">
                        {d.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-text-secondary text-xs capitalize">
                  {d.kind.replace("_", " ")}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {d.vehiclePlate}
                </td>
                <td className="px-4 py-3">
                  <Badge tone={d.online ? "online" : "offline"}>
                    {d.online ? "Online" : "Offline"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1.5 font-mono tabular">
                    <Signal className="w-3 h-3 text-text-muted" />
                    {d.signal}%
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-1.5 font-mono tabular">
                    <Battery
                      className={`w-3 h-3 ${
                        d.battery < 30 ? "text-[#ef4444]" : "text-text-muted"
                      }`}
                    />
                    {d.battery}%
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-mono text-xs">
                  v{d.firmware}
                </td>
                <td className="px-4 py-3">
                  {d.tamper ? (
                    <span className="inline-flex items-center gap-1 text-xs text-[#ef4444]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Tamper
                    </span>
                  ) : (
                    <Badge tone="success">Clean</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-xs text-text-muted font-mono">
                  {relativeTime(d.lastSeen)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
