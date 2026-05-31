"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { allAlerts } from "@/data";

export function Topbar() {
  const unread = allAlerts.filter((a) => a.state === "new").length;

  return (
    <header className="h-14 shrink-0 flex items-center gap-3 px-5 border-b border-border-subtle bg-bg-base/70 backdrop-blur sticky top-0 z-10">
      {/* Org switcher */}
      <button className="flex items-center gap-2 px-3 h-9 rounded-md bg-bg-elevated border border-border-soft text-sm hover:border-accent/30 transition">
        <span className="w-5 h-5 rounded bg-accent/20 text-accent text-[10px] font-bold flex items-center justify-center">
          TR
        </span>
        <span className="font-medium">Trackr Logistics</span>
        <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search vehicles, drivers, plates…"
          className="w-full h-9 pl-9 pr-3 rounded-md bg-bg-elevated border border-border-subtle text-sm placeholder:text-text-muted focus:border-accent/50 outline-none transition"
        />
      </div>

      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 rounded-md bg-bg-elevated border border-border-subtle flex items-center justify-center hover:border-accent/30 transition">
          <Bell className="w-4 h-4 text-text-secondary" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ef4444] text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(239,68,68,0.55)]">
              {unread}
            </span>
          )}
        </button>

        <button className="flex items-center gap-2 pl-1.5 pr-2.5 h-9 rounded-md bg-bg-elevated border border-border-subtle hover:border-accent/30 transition">
          <span className="w-6 h-6 rounded-full bg-gradient-to-br from-accent to-accent-secondary text-white text-[10px] font-bold flex items-center justify-center">
            IA
          </span>
          <span className="text-xs text-text-secondary">Inioluwa</span>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>
    </header>
  );
}
