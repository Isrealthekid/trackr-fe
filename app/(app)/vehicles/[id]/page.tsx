import { notFound } from "next/navigation";
import Link from "next/link";
import {
  allAlerts,
  allTrips,
  allVehicles,
  relativeTime,
  statusLabel,
} from "@/data";
import { Badge, StatusDot } from "@/components/StatusDot";
import {
  Gauge,
  Droplet,
  Thermometer,
  BatteryCharging,
  Activity,
  Edit3,
  UserCog,
  Cpu,
} from "lucide-react";
import { VehicleDetailTabs } from "./VehicleDetailTabs";

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = allVehicles.find((v) => v.id === id);
  if (!vehicle) return notFound();

  const trips = allTrips.filter((t) => t.vehicleId === vehicle.id);
  const alerts = allAlerts.filter((a) => a.vehicleId === vehicle.id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="text-[11px] text-text-muted font-mono mb-1">
            <Link href="/vehicles" className="hover:text-text-secondary">
              Vehicles
            </Link>{" "}
            / {vehicle.id}
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              {vehicle.nickname}
            </h1>
            <Badge
              tone={
                vehicle.status === "moving"
                  ? "online"
                  : vehicle.status === "alert"
                  ? "offline"
                  : vehicle.status === "idle"
                  ? "warning"
                  : "neutral"
              }
            >
              <StatusDot status={vehicle.status} /> {statusLabel(vehicle.status)}
            </Badge>
            <span className="text-text-muted text-[11px] font-mono">
              {relativeTime(vehicle.lastSeen)}
            </span>
          </div>
          <div className="text-sm text-text-secondary mt-1 font-mono">
            {vehicle.plate} · {vehicle.make} {vehicle.model} · {vehicle.year}
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-bg-elevated border border-border-soft text-sm text-text-secondary hover:border-accent/30 hover:text-text-primary transition">
            <UserCog className="w-4 h-4" /> Assign driver
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-bg-elevated border border-border-soft text-sm text-text-secondary hover:border-accent/30 hover:text-text-primary transition">
            <Cpu className="w-4 h-4" /> Manage device
          </button>
          <button className="flex items-center gap-2 h-9 px-3 rounded-md bg-bg-elevated border border-border-soft text-sm text-text-secondary hover:border-accent/30 hover:text-text-primary transition">
            <Edit3 className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <KpiTile
          icon={<Gauge className="w-3.5 h-3.5" />}
          label="Speed"
          value={`${vehicle.speed}`}
          unit="km/h"
        />
        <KpiTile
          icon={<Droplet className="w-3.5 h-3.5" />}
          label="Fuel"
          value={`${vehicle.fuel}`}
          unit="%"
          tone={vehicle.fuel < 20 ? "warn" : "default"}
        />
        <KpiTile
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Engine hrs"
          value={vehicle.engineHours.toLocaleString()}
        />
        <KpiTile
          icon={<Activity className="w-3.5 h-3.5" />}
          label="Odometer"
          value={vehicle.odometer.toLocaleString()}
          unit="km"
        />
        <KpiTile
          icon={<Thermometer className="w-3.5 h-3.5" />}
          label="Coolant"
          value={`${vehicle.coolantTemp}`}
          unit="°C"
          tone={vehicle.coolantTemp > 100 ? "warn" : "default"}
        />
        <KpiTile
          icon={<BatteryCharging className="w-3.5 h-3.5" />}
          label="Battery"
          value={`${vehicle.battery}`}
          unit="V"
        />
      </div>

      <VehicleDetailTabs vehicle={vehicle} trips={trips} alerts={alerts} />
    </div>
  );
}

function KpiTile({
  icon,
  label,
  value,
  unit,
  tone = "default",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  tone?: "default" | "warn";
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-bg-surface p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.08em] text-text-muted">
        <span className={tone === "warn" ? "text-[#f59e0b]" : ""}>{icon}</span>
        {label}
      </div>
      <div className="text-lg font-mono tabular mt-1.5">
        <span className={tone === "warn" ? "text-[#f59e0b]" : ""}>{value}</span>
        {unit && (
          <span className="text-text-muted text-xs ml-1">{unit}</span>
        )}
      </div>
    </div>
  );
}
