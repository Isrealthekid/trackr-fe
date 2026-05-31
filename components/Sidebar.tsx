"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Truck,
  Route,
  Bell,
  MapPinned,
  Users,
  Cpu,
  FileBarChart2,
  Layers,
  Settings,
  Activity,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/vehicles", label: "Vehicles", icon: Truck },
  { href: "/trips", label: "Trips", icon: Route },
  { href: "/alerts", label: "Alerts", icon: Bell, badge: 2 },
  { href: "/geofences", label: "Geofences", icon: MapPinned },
  { href: "/drivers", label: "Drivers", icon: Users },
  { href: "/devices", label: "Devices", icon: Cpu, badge: 1, badgeTone: "danger" as const },
  { href: "/reports", label: "Reports", icon: FileBarChart2 },
  { href: "/fleets", label: "Fleets", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] shrink-0 flex flex-col bg-bg-surface border-r border-border-subtle">
      <div className="px-5 h-14 flex items-center gap-2 border-b border-border-subtle">
        <div className="w-8 h-8 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center">
          <Activity className="w-4 h-4 text-accent" strokeWidth={2.2} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold tracking-tight">Trackr</div>
          <div className="text-[10px] text-text-muted uppercase tracking-[0.1em]">
            Fleet Telematics
          </div>
        </div>
      </div>

      <div className="px-3 py-3">
        <div className="px-2 mb-2 text-[10px] uppercase tracking-[0.1em] text-text-muted">
          Operations
        </div>
        <nav className="space-y-0.5">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2.5 pl-3 pr-2 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-accent/10 text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r bg-accent shadow-[0_0_8px_rgba(59,130,246,0.65)]" />
                )}
                <Icon
                  className={`w-4 h-4 ${
                    active ? "text-accent" : "text-text-muted"
                  }`}
                  strokeWidth={1.75}
                />
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      item.badgeTone === "danger"
                        ? "bg-[rgba(239,68,68,0.15)] text-[#ef4444]"
                        : "bg-bg-elevated text-text-secondary"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-3 border-t border-border-subtle">
        <div className="rounded-xl border border-border-soft bg-bg-elevated p-3">
          <div className="text-[10px] uppercase tracking-[0.1em] text-text-muted mb-1">
            Pilot tier
          </div>
          <div className="text-sm font-medium mb-2">14 days left</div>
          <button className="w-full h-8 rounded-md bg-accent/90 hover:bg-accent text-white text-xs font-medium transition">
            Upgrade plan
          </button>
        </div>
        <Link
          href="/login"
          className="mt-3 flex items-center gap-2 text-xs text-text-muted hover:text-text-primary transition px-2 py-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign out
        </Link>
      </div>
    </aside>
  );
}
