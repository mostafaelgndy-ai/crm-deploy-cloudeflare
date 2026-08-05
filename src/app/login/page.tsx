"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/Button";
import { FieldLabel } from "@/components/FieldLabel";
import { getEmployees, setEmpSession, getEmpSession } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If already authed, redirect to /
    const session = getEmpSession();
    if (session) {
      router.replace("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
    setChecking(false);
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{4,}$/.test(password.trim())) {
      setError("Password must be at least 4 numbers.");
      return;
    }

    const employees = getEmployees();
    const match = employees.find(
      (emp) => emp.username === username.trim() && emp.password === password.trim(),
    );

    if (!match) {
      setError("That username and password don't match our records.");
      return;
    }

    setEmpSession({ username: match.username });
    router.push("/");
  };

  if (checking) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted text-sm font-mono">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center px-5">
      <div className="w-full max-w-sm rise-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-lg bg-amber text-ink2 flex items-center justify-center font-mono font-bold rotate-[-4deg] mb-4">
            OD
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Sign in to OPS/DESK</h1>
          <p className="text-sm text-muted mt-1">Use the credentials your admin gave you.</p>
        </div>

        <form onSubmit={handleSubmit} className="panel-card p-6 space-y-4">
          <div>
            <FieldLabel>Username</FieldLabel>
            <input
              type="text"
              autoComplete="username"
              placeholder="e.g. youssef.dev"
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
              placeholder="At least 4 numbers"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-[11px] text-muted mt-1.5">Passwords are numeric, 4 digits or more.</p>
          </div>
          {error && <p className="text-sm text-red">{error}</p>}
          <Button type="submit" variant="amber" className="w-full">
            SIGN IN →
          </Button>
        </form>

        <p className="text-center text-xs text-muted mt-6">
          Administrator?{" "}
          <Link href="/admin" className="text-amber hover:underline">
            Go to the admin desk
          </Link>
        </p>
      </div>
    </div>
  );
}