"use client";

import { useState } from "react";
import {
  Building2,
  Users,
  BellRing,
  CreditCard,
  UserCircle,
  Key,
} from "lucide-react";
import { allMembers, relativeTime } from "@/data";
import { Badge } from "@/components/StatusDot";
import { PageHeader } from "@/components/PageHeader";

type Section =
  | "organization"
  | "members"
  | "notifications"
  | "billing"
  | "profile"
  | "api";

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "members", label: "Members", icon: Users },
  { id: "notifications", label: "Notifications", icon: BellRing },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "profile", label: "Profile", icon: UserCircle },
  { id: "api", label: "API", icon: Key },
];

export default function SettingsPage() {
  const [section, setSection] = useState<Section>("organization");

  return (
    <div className="p-6">
      <PageHeader
        title="Settings"
        subtitle="Organization preferences, members, and notifications"
      />

      <div className="flex gap-6">
        <nav className="w-[200px] shrink-0 space-y-0.5">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const active = section === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSection(s.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition ${
                  active
                    ? "bg-accent/10 text-text-primary"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    active ? "text-accent" : "text-text-muted"
                  }`}
                />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="flex-1 min-w-0">
          {section === "organization" && <OrganizationSection />}
          {section === "members" && <MembersSection />}
          {section === "notifications" && <NotificationsSection />}
          {section === "billing" && <BillingSection />}
          {section === "profile" && <ProfileSection />}
          {section === "api" && <ApiSection />}
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-bg-surface p-5 mb-4">
      <h3 className="text-sm font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="text-[10px] text-text-muted uppercase tracking-wider">
        {label}
      </label>
      <input
        defaultValue={value}
        className="w-full h-9 px-3 mt-1 rounded-md bg-bg-elevated border border-border-subtle text-sm focus:border-accent/50 outline-none transition"
      />
    </div>
  );
}

function OrganizationSection() {
  return (
    <>
      <Card title="Organization">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Organization name" value="Trackr Logistics" />
          <Field label="Country" value="Nigeria" />
          <Field label="Timezone" value="Africa/Lagos (GMT+1)" />
          <Field label="Vehicle limit" value="50" />
        </div>
      </Card>
    </>
  );
}

function MembersSection() {
  return (
    <Card title="Team members">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.08em] text-text-muted">
            <th className="text-left pb-2 font-medium">Name</th>
            <th className="text-left pb-2 font-medium">Email</th>
            <th className="text-left pb-2 font-medium">Role</th>
            <th className="text-right pb-2 font-medium">Last active</th>
          </tr>
        </thead>
        <tbody>
          {allMembers.map((m) => (
            <tr key={m.id} className="border-t border-border-subtle">
              <td className="py-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-accent to-accent-secondary text-white text-[10px] font-bold flex items-center justify-center">
                    {m.name
                      .split(" ")
                      .map((p) => p[0])
                      .join("")}
                  </div>
                  <span className="text-sm">{m.name}</span>
                </div>
              </td>
              <td className="py-3 text-text-secondary font-mono text-xs">
                {m.email}
              </td>
              <td className="py-3">
                <Badge
                  tone={
                    m.role === "Owner"
                      ? "warning"
                      : m.role === "Admin"
                      ? "info"
                      : "neutral"
                  }
                >
                  {m.role}
                </Badge>
              </td>
              <td className="py-3 text-right text-xs text-text-muted font-mono">
                {relativeTime(m.lastActive)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function NotificationsSection() {
  const channels = ["Push", "SMS", "Email", "WhatsApp"];
  const events = ["Critical alert", "Geofence breach", "Harsh driving", "Idle", "Trip completion"];
  return (
    <Card title="Notification preferences">
      <p className="text-xs text-text-secondary mb-4">
        Granular per-event, per-channel control. Built to fight alert fatigue.
      </p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.08em] text-text-muted">
            <th className="text-left pb-3 font-medium">Event</th>
            {channels.map((c) => (
              <th key={c} className="text-center pb-3 font-medium">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={e} className="border-t border-border-subtle">
              <td className="py-3 text-sm">{e}</td>
              {channels.map((c) => {
                const on = (i + c.length) % 3 !== 0;
                return (
                  <td key={c} className="py-3 text-center">
                    <button
                      className={`w-9 h-5 rounded-full relative transition ${
                        on ? "bg-accent" : "bg-bg-surface-2 border border-border-soft"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition ${
                          on ? "left-[18px]" : "left-0.5"
                        }`}
                      />
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function BillingSection() {
  return (
    <>
      <Card title="Plan">
        <div className="flex items-center justify-between">
          <div>
            <Badge tone="info">Pro</Badge>
            <div className="text-sm mt-2">12 vehicles · ₦18,000 / vehicle / mo</div>
            <div className="text-xs text-text-muted mt-1 font-mono">
              Next invoice: 2026-06-01 · ₦216,000
            </div>
          </div>
          <button className="h-9 px-4 rounded-md bg-accent/90 hover:bg-accent text-white text-sm transition">
            Manage plan
          </button>
        </div>
      </Card>
      <Card title="Invoices">
        <div className="text-xs text-text-secondary">
          May 2026 · ₦216,000 · paid
        </div>
        <div className="text-xs text-text-secondary mt-2">
          April 2026 · ₦216,000 · paid
        </div>
      </Card>
    </>
  );
}

function ProfileSection() {
  return (
    <Card title="Profile">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Full name" value="Inioluwa Adeyinka" />
        <Field label="Email" value="inioluwa.adeyinka@outlook.com" />
        <Field label="Phone" value="+234 803 000 0000" />
        <Field label="Default timezone" value="Africa/Lagos (GMT+1)" />
      </div>
    </Card>
  );
}

function ApiSection() {
  return (
    <Card title="API keys">
      <div className="rounded-md bg-bg-elevated border border-border-subtle p-3 font-mono text-xs text-text-secondary">
        sk_live_••••••••••••••••••••••••••••••••6f2a
      </div>
      <p className="text-[11px] text-text-muted mt-2">
        Enterprise tier · keys can be rotated from the CLI.
      </p>
    </Card>
  );
}
