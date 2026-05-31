"use client";

import Link from "next/link";
import { useState } from "react";
import { Truck, Building2, User, ChevronRight, Activity } from "lucide-react";

type AccountType = "individual" | "organization";
type Role = "owner" | "admin" | "manager" | "dispatcher" | "viewer";

const ROLES: { id: Role; label: string; blurb: string }[] = [
  { id: "owner", label: "Owner", blurb: "Full access, billing & ownership" },
  { id: "admin", label: "Admin", blurb: "Full operational control" },
  { id: "manager", label: "Manager", blurb: "Scoped to assigned fleets" },
  {
    id: "dispatcher",
    label: "Dispatcher",
    blurb: "Acknowledge alerts, assign drivers",
  },
  { id: "viewer", label: "Viewer", blurb: "Read-only across the fleet" },
];

export default function LoginPage() {
  const [type, setType] = useState<AccountType>("organization");
  const [role, setRole] = useState<Role>("owner");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-[480px] h-[480px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.18),transparent_60%)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_60%)] blur-3xl" />
      </div>

      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-accent" strokeWidth={2} />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            Trackr<span className="text-text-muted">.fleet</span>
          </span>
        </div>

        <div className="glass-card p-8">
          <h1 className="text-xl font-semibold mb-1">Sign in to Trackr</h1>
          <p className="text-sm text-text-secondary mb-6">
            Pick how you operate and your role — we&apos;ll take you in.
          </p>

          {/* Account type dial */}
          <label className="block text-[11px] uppercase tracking-[0.08em] text-text-muted mb-2">
            Account type
          </label>
          <div className="grid grid-cols-2 gap-2 mb-6">
            <TypeChip
              active={type === "individual"}
              onClick={() => setType("individual")}
              icon={<User className="w-4 h-4" />}
              label="Individual"
              hint="Just me & my trucks"
            />
            <TypeChip
              active={type === "organization"}
              onClick={() => setType("organization")}
              icon={<Building2 className="w-4 h-4" />}
              label="Organization"
              hint="I manage a team"
            />
          </div>

          {/* Role dial */}
          <label className="block text-[11px] uppercase tracking-[0.08em] text-text-muted mb-2">
            Role
          </label>
          <div className="space-y-1.5 mb-6">
            {ROLES.map((r) => (
              <RoleRow
                key={r.id}
                active={role === r.id}
                onClick={() => setRole(r.id)}
                label={r.label}
                blurb={r.blurb}
                disabled={type === "individual" && r.id !== "owner"}
              />
            ))}
          </div>

          <Link
            href="/dashboard"
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-accent/90 hover:bg-accent text-white text-sm font-medium transition shadow-[0_8px_24px_rgba(59,130,246,0.35)] hover:shadow-[0_0_16px_rgba(59,130,246,0.55)]"
          >
            <Truck className="w-4 h-4" />
            Enter dashboard
            <ChevronRight className="w-4 h-4" />
          </Link>

          <div className="mt-4 text-center">
            <span className="text-xs text-text-muted">
              Demo build · authentication is mocked
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-text-muted mt-6">
          Heavy-Duty Fleet Telematics · Demo by Inioluwa Adeyinka
        </p>
      </div>
    </div>
  );
}

function TypeChip({
  active,
  onClick,
  icon,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`group text-left px-3 py-3 rounded-xl border transition ${
        active
          ? "bg-accent/10 border-accent/40 text-text-primary shadow-[0_0_20px_rgba(59,130,246,0.18)]"
          : "bg-bg-elevated border-border-soft text-text-secondary hover:border-accent/30 hover:text-text-primary"
      }`}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            active ? "bg-accent/20 text-accent" : "bg-bg-surface-2 text-text-muted"
          }`}
        >
          {icon}
        </span>
        {label}
      </div>
      <div className="text-[11px] text-text-muted mt-1.5 pl-9">{hint}</div>
    </button>
  );
}

function RoleRow({
  active,
  onClick,
  label,
  blurb,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  blurb: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-left transition ${
        disabled
          ? "opacity-40 cursor-not-allowed bg-bg-surface border-border-subtle"
          : active
          ? "bg-accent/10 border-accent/40 text-text-primary"
          : "bg-bg-surface border-border-subtle text-text-secondary hover:border-accent/25 hover:text-text-primary"
      }`}
    >
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-[11px] text-text-muted">{blurb}</div>
      </div>
      <div
        className={`w-3.5 h-3.5 rounded-full border ${
          active ? "border-accent bg-accent shadow-[0_0_10px_rgba(59,130,246,0.6)]" : "border-border-soft"
        }`}
      />
    </button>
  );
}
