"use client";

import { useEffect, useState } from "react";
import { getEmpSession, clearEmpSession } from "@/lib/storage";
import type { EmployeeSession } from "@/lib/types";

interface UseAuthResult {
  /** null while checking, EmployeeSession if authed, or false-ish if not. */
  session: EmployeeSession | null;
  /** True until the initial session check completes. */
  loading: boolean;
  /** Clear the employee session and return null. */
  logout: () => void;
}

/**
 * Employee auth hook — reads the session from localStorage on mount
 * (inside useEffect to avoid SSR issues). Returns the session, a
 * loading flag, and a logout function.
 */
export function useAuth(): UseAuthResult {
  const [session, setSession] = useState<EmployeeSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
    setSession(getEmpSession());
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
    setLoading(false);
  }, []);

  const logout = () => {
    clearEmpSession();
    setSession(null);
  };

  return { session, loading, logout };
}