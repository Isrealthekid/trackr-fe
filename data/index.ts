import vehicles from "./vehicles.json";
import trips from "./trips.json";
import alerts from "./alerts.json";
import drivers from "./drivers.json";
import devices from "./devices.json";
import geofences from "./geofences.json";
import reports from "./reports.json";
import fleets from "./fleets.json";
import members from "./members.json";

export type VehicleStatus = "moving" | "idle" | "parked" | "alert";
export type AlertSeverity = "critical" | "warning" | "info";
export type AlertState = "new" | "acknowledged" | "resolved";

export interface Vehicle {
  id: string;
  plate: string;
  nickname: string;
  make: string;
  model: string;
  year: number;
  driver: string;
  driverId: string;
  status: VehicleStatus;
  speed: number;
  fuel: number;
  engineHours: number;
  odometer: number;
  coolantTemp: number;
  battery: number;
  lat: number;
  lng: number;
  address: string;
  lastSeen: string;
  deviceId: string;
  fleet: string;
  alerts: number;
}

export interface Trip {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  driver: string;
  origin: string;
  destination: string;
  startedAt: string;
  endedAt: string | null;
  durationMin: number;
  distanceKm: number;
  avgSpeed: number;
  maxSpeed: number;
  status: "completed" | "in_transit";
  delay: number;
}

export interface Alert {
  id: string;
  type: string;
  severity: AlertSeverity;
  vehicleId: string;
  vehiclePlate: string;
  driver: string;
  title: string;
  message: string;
  time: string;
  location: string;
  lat: number;
  lng: number;
  state: AlertState;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleId: string;
  vehiclePlate: string;
  score: number;
  tripsThisMonth: number;
  harshBraking: number;
  speeding: number;
  nightDriving: number;
}

export interface Device {
  id: string;
  serial: string;
  kind: "main_unit" | "dongle";
  vehicleId: string;
  vehiclePlate: string;
  online: boolean;
  signal: number;
  battery: number;
  firmware: string;
  tamper: boolean;
  lastSeen: string;
}

export interface Geofence {
  id: string;
  name: string;
  rule: "entry" | "exit" | "both";
  enabled: boolean;
  color: string;
  appliesTo: string;
  activeHours: string;
  polygon: [number, number][];
}

export interface Report {
  id: string;
  name: string;
  type: "fuel" | "behaviour" | "utilization" | "alerts";
  scope: string;
  range: string;
  generatedAt: string;
  format: "pdf" | "xlsx";
  sizeKb: number;
}

export interface Fleet {
  id: string;
  name: string;
  vehicleCount: number;
  manager: string;
  region: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Manager" | "Dispatcher" | "Viewer";
  lastActive: string;
}

export const allVehicles = vehicles as Vehicle[];
export const allTrips = trips as Trip[];
export const allAlerts = alerts as Alert[];
export const allDrivers = drivers as Driver[];
export const allDevices = devices as Device[];
export const allGeofences = geofences as Geofence[];
export const allReports = reports as Report[];
export const allFleets = fleets as Fleet[];
export const allMembers = members as Member[];

export function statusColor(status: VehicleStatus): string {
  switch (status) {
    case "moving":
      return "var(--status-online)";
    case "idle":
      return "var(--status-transit)";
    case "parked":
      return "var(--status-idle)";
    case "alert":
      return "var(--status-danger)";
  }
}

export function statusLabel(status: VehicleStatus): string {
  switch (status) {
    case "moving":
      return "Moving";
    case "idle":
      return "Idle";
    case "parked":
      return "Parked";
    case "alert":
      return "Alerting";
  }
}

export function relativeTime(iso: string): string {
  const t = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, Math.floor((now - t) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
