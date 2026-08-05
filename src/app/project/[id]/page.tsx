"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { StubCard } from "@/components/StubCard";
import { Stamp } from "@/components/Stamp";
import { Button } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { getProject, getTicketsByProject } from "@/lib/storage";
import { STATUS_META } from "@/lib/constants";
import { fmtDate } from "@/lib/utils";
import type { Project, Ticket } from "@/lib/types";

export default function ProjectTicketsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const { session, loading, logout } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  useEffect(() => {
    if (session && projectId) {
      const p = getProject(projectId);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
      setProject(p ?? null);
      if (p) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reading from localStorage on mount
        setTickets(getTicketsByProject(projectId));
      }
    }
  }, [session, projectId]);

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

  if (!project) {
    return (
      <>
        <TopBar context="Not found" right="" />
        <main className="flex-1 max-w-6xl w-full mx-auto px-5 md:px-8 py-16 text-center">
          <p className="font-display text-xl mb-2">This project doesn't exist</p>
          <Link href="/" className="text-amber hover:underline text-sm">
            ← Back to the project board
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <TopBar
        context="Project Tickets"
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
        <nav className="text-sm mb-6 font-mono">
          <Link href="/" className="text-muted hover:text-amber transition">
            Projects
          </Link>{" "}
          <span className="text-[#3A4252]">/</span>{" "}
          <span className="text-[#EDEFF3]">{project.title}</span>
        </nav>

        <div className="mb-8">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">
            {project.title}
          </h1>
          <p className="text-muted text-sm mt-1 max-w-2xl">{project.description}</p>
          <div className="flex gap-4 text-[11px] font-mono uppercase tracking-wide text-muted mt-3">
            <span>Start {fmtDate(project.startedAt)}</span>
            <span>·</span>
            <span>Due {fmtDate(project.expectedEndAt)}</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-3">
          {tickets.length === 0 ? (
            <EmptyState
              title="No tickets here yet"
              message="Nothing has been filed for this project."
            />
          ) : (
            tickets.map((t) => {
              const meta = STATUS_META[t.status];
              const closed = t.status === "closed";
              return (
                <StubCard
                  key={t.id}
                  stripColor={meta.color}
                  closed={closed}
                  href={closed ? undefined : `/ticket/${t.id}`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3
                      className={`font-display font-bold text-[16px] leading-snug ${
                        !closed ? "group-hover:text-amberdark" : ""
                      } transition`}
                    >
                      {t.title}
                    </h3>
                  </div>
                  <p className="text-[13px] text-[#4A4032] leading-relaxed mb-4 line-clamp-3">
                    {t.description}
                  </p>
                  <div className="pt-3 border-t border-dashed border-[#C9BC9C]">
                    <Stamp label={meta.label} color={meta.color} />
                  </div>
                </StubCard>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}