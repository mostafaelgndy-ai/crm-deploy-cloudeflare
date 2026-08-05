"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Button } from "@/components/Button";
import { FieldLabel } from "@/components/FieldLabel";
import { ProjectsTab } from "@/components/admin/ProjectsTab";
import { TicketsTab } from "@/components/admin/TicketsTab";
import { EmployeesTab } from "@/components/admin/EmployeesTab";
import { isAdminAuthed, setAdminSession, clearAdminSession } from "@/lib/storage";
import { ADMIN } from "@/lib/constants";
import { seedData } from "@/lib/seed";

type AdminTab = "projects" | "tickets" | "employees";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>("projects");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Seed data on first visit
    seedData();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
    setAuthed(isAdminAuthed());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
    setChecking(false);
  }, []);

  const handleRefresh = () => {
    setRefreshKey((k) => k + 1);
  };

  const handleLogout = () => {
    clearAdminSession();
    setAuthed(false);
  };

  if (checking) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted text-sm font-mono">Loading…</p>
      </div>
    );
  }

  if (!authed) {
    return <AdminLoginForm onLogin={() => setAuthed(true)} />;
  }

  return (
    <>
      <TopBar
        context="Admin Desk"
        right={
          <>
            <span className="text-sm text-muted hidden sm:inline">
              Signed in as{" "}
              <span className="text-[#EDEFF3] font-medium">{ADMIN.username}</span>
            </span>
            <Button variant="panel-red" onClick={handleLogout}>
              SIGN OUT
            </Button>
          </>
        }
      />
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 md:px-8 py-10">
        <div className="mb-7 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
              Admin Desk
            </h1>
            <p className="text-muted text-sm mt-1">
              Everything staff see on the board is edited here.
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-amber hover:underline font-mono"
          >
            VIEW BOARD AS EMPLOYEE →
          </Link>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 border-b border-[#2A3240]">
          {(["projects", "tickets", "employees"] as AdminTab[]).map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 text-sm font-mono uppercase tracking-wide border-b-2 -mb-px transition ${
                  active
                    ? "border-amber text-amber"
                    : "border-transparent text-muted hover:text-[#EDEFF3]"
                }`}
              >
                {tab === "projects" ? "Projects" : tab === "tickets" ? "Tickets" : "Employees"}
              </button>
            );
          })}
        </div>

        {/* Active tab content */}
        <div key={refreshKey}>
          {activeTab === "projects" && <ProjectsTab onRefresh={handleRefresh} />}
          {activeTab === "tickets" && <TicketsTab onRefresh={handleRefresh} />}
          {activeTab === "employees" && <EmployeesTab onRefresh={handleRefresh} />}
        </div>
      </main>
    </>
  );
}

/* ----------------------------------------------------------------
   Admin login form
----------------------------------------------------------------- */

function AdminLoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (username.trim() !== ADMIN.username || password.trim() !== ADMIN.password) {
      setError("Incorrect admin username or password.");
      return;
    }

    setAdminSession();
    onLogin();
  };

  return (
    <div className="flex-1 flex items-center justify-center px-5">
      <div className="w-full max-w-sm rise-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-lg bg-[#212938] border border-[#2A3240] text-amber flex items-center justify-center font-mono font-bold rotate-[-4deg] mb-4">
            A
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Admin desk</h1>
          <p className="text-sm text-muted mt-1">Manage projects, tickets and staff accounts.</p>
        </div>

        <form onSubmit={handleSubmit} className="panel-card p-6 space-y-4">
          <div>
            <FieldLabel>Username</FieldLabel>
            <input
              type="text"
              autoComplete="username"
              placeholder="Admin username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Password</FieldLabel>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Admin password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-[#E8A33D]"
            />
            Remember me on this device
          </label>
          {error && <p className="text-sm text-red">{error}</p>}
          <Button type="submit" variant="amber" className="w-full">
            ENTER ADMIN DESK →
          </Button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          <Link href="/login" className="text-amber hover:underline">
            ← Back to employee sign in
          </Link>
        </p>
      </div>
    </div>
  );
}