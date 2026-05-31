import { Plus, Phone } from "lucide-react";
import { allDrivers } from "@/data";
import { PageHeader } from "@/components/PageHeader";

export default function DriversPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Drivers"
        subtitle={`${allDrivers.length} drivers across the fleet`}
        actions={
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-accent/90 hover:bg-accent text-white text-sm transition">
            <Plus className="w-4 h-4" />
            Register driver
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {allDrivers.map((d) => {
          const tone =
            d.score >= 85
              ? "status-success"
              : d.score >= 70
              ? "status-transit"
              : "status-danger";
          return (
            <div
              key={d.id}
              className="rounded-xl border border-border-soft bg-bg-surface p-4 hover:border-accent/30 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/80 to-accent-secondary/80 text-white font-bold flex items-center justify-center text-sm">
                    {d.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{d.name}</div>
                    <div className="text-[11px] text-text-muted font-mono">
                      {d.id} · {d.vehiclePlate}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-lg font-mono tabular font-semibold"
                    style={{ color: `var(--${tone})` }}
                  >
                    {d.score}
                  </div>
                  <div className="text-[10px] text-text-muted uppercase tracking-wider">
                    score
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-text-secondary flex items-center gap-1.5 mb-3">
                <Phone className="w-3 h-3" />
                {d.phone}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Stat label="Trips" value={d.tripsThisMonth} />
                <Stat label="Harsh" value={d.harshBraking} />
                <Stat label="Speed" value={d.speeding} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-bg-surface-2 border border-border-subtle px-2 py-1.5 text-center">
      <div className="text-sm font-mono tabular">{value}</div>
      <div className="text-[10px] text-text-muted uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}
