"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { StubCard } from "@/components/StubCard";
import { Stamp } from "@/components/Stamp";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { getProjects } from "@/lib/storage";
import { seedData } from "@/lib/seed";
import { fmtDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

export default function ProjectsBoardPage() {
  const router = useRouter();
  const { session, loading, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Seed data on first visit
    seedData();
  }, []);

  useEffect(() => {
    // Redirect to login if not authed
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  useEffect(() => {
    // Load projects after auth check passes
    if (session) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
      setProjects(getProjects());
    }
  }, [session]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (loading || !session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted text-sm font-mono">Loading…</p>
      </div>
    );
  }

  return (
    <>
      <TopBar
        context="Project Board"
        right={
          <>
            <span className="text-sm text-muted hidden sm:inline">
              Signed in as{" "}
              <span className="text-[#EDEFF3] font-medium">{session.username}</span>
            </span>
            <Button variant="panel-red" onClick={handleLogout}>
              SIGN OUT
            </Button>
          </>
        }
      />
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            Current Projects
          </h1>
          <p className="text-muted text-sm mt-1">Pick a project to see its open tickets.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
          {projects.length === 0 ? (
            <EmptyState
              title="No projects yet"
              message="Your admin hasn't opened a project. Check back soon."
            />
          ) : (
            projects.map((p) => (
              <StubCard
                key={p.id}
                stripColor={p.closed ? "#C1503F" : "#E8A33D"}
                closed={p.closed}
                href={p.closed ? undefined : `/project/${p.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3
                    className={`font-display font-bold text-[17px] leading-snug ${
                      !p.closed ? "group-hover:text-amberdark" : ""
                    } transition`}
                  >
                    {p.title}
                  </h3>
                  {p.closed && <Stamp label="Closed" color="#C1503F" />}
                </div>
                <p className="text-[13.5px] text-[#4A4032] leading-relaxed mb-4 line-clamp-3">
                  {p.description}
                </p>
                <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-wide text-[#7A6E56] border-t border-dashed border-[#C9BC9C] pt-3">
                  <span>Start {fmtDate(p.startedAt)}</span>
                  <span>Due {fmtDate(p.expectedEndAt)}</span>
                </div>
              </StubCard>
            ))
          )}
        </div>
      </main>
    </>
  );
}