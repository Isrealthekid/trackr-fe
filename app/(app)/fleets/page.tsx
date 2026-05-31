import { Plus, Users, Truck, MapPin } from "lucide-react";
import { allFleets } from "@/data";
import { PageHeader } from "@/components/PageHeader";

export default function FleetsPage() {
  return (
    <div className="p-6">
      <PageHeader
        title="Fleets"
        subtitle="Group vehicles for managers, reporting, and geofencing"
        actions={
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-accent/90 hover:bg-accent text-white text-sm transition">
            <Plus className="w-4 h-4" />
            New fleet
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {allFleets.map((f) => (
          <div
            key={f.id}
            className="rounded-xl border border-border-soft bg-bg-surface p-5 hover:border-accent/30 transition"
          >
            <div className="text-[11px] text-text-muted font-mono mb-1">
              {f.id}
            </div>
            <div className="text-base font-semibold">{f.name}</div>
            <div className="text-xs text-text-secondary mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> {f.region}
            </div>

            <div className="mt-4 flex gap-2">
              <div className="flex-1 rounded-md bg-bg-surface-2 border border-border-subtle p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted">
                  <Truck className="w-3 h-3" /> Vehicles
                </div>
                <div className="text-lg font-mono tabular mt-1">
                  {f.vehicleCount}
                </div>
              </div>
              <div className="flex-1 rounded-md bg-bg-surface-2 border border-border-subtle p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-text-muted">
                  <Users className="w-3 h-3" /> Manager
                </div>
                <div className="text-xs mt-1 truncate">{f.manager}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
