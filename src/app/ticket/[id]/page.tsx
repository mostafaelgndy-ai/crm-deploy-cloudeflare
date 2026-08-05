"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/TopBar";
import { Stamp } from "@/components/Stamp";
import { Button } from "@/components/Button";
import { FieldLabel } from "@/components/FieldLabel";
import { useAuth } from "@/hooks/useAuth";
import { getTicket, getProject, updateTicketStatus } from "@/lib/storage";
import { STATUS_META, EMPLOYEE_ALLOWED_STATUSES } from "@/lib/constants";
import { fmtDate, downloadTicketMarkdown } from "@/lib/utils";
import type { Ticket, Project, TicketStatus } from "@/lib/types";

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const ticketId = params.id as string;
  const { session, loading, logout } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/login");
    }
  }, [loading, session, router]);

  useEffect(() => {
    if (session && ticketId) {
      const t = getTicket(ticketId);
      if (t) {
        setTicket(t);
        const p = getProject(t.projectId);
        setProject(p ?? null);
      }
    }
  }, [session, ticketId]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!ticket) return;
    updateTicketStatus(ticket.id, newStatus);
    // Reload the ticket from storage to reflect the updated status + endsAt
    const updated = getTicket(ticket.id);
    if (updated) {
      setTicket(updated);
    }
  };

  const handleDownload = () => {
    if (ticket) {
      downloadTicketMarkdown(ticket);
    }
  };

  if (loading || !session) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-muted text-sm font-mono">Loading…</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <>
        <TopBar context="Not found" right="" />
        <main className="flex-1 max-w-3xl w-full mx-auto px-5 md:px-8 py-16 text-center">
          <p className="font-display text-xl mb-2">This ticket doesn't exist</p>
          <Link href="/" className="text-amber hover:underline text-sm">
            ← Back to the project board
          </Link>
        </main>
      </>
    );
  }

  const meta = STATUS_META[ticket.status];

  return (
    <>
      <TopBar
        context="Ticket Detail"
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
      <main className="flex-1 max-w-3xl w-full mx-auto px-5 md:px-8 py-10">
        <nav className="text-sm mb-6 font-mono">
          <Link href="/" className="text-muted hover:text-amber transition">
            Projects
          </Link>{" "}
          <span className="text-[#3A4252]">/</span>{" "}
          {project ? (
            <Link
              href={`/project/${project.id}`}
              className="text-muted hover:text-amber transition"
            >
              {project.title}
            </Link>
          ) : (
            "Project"
          )}{" "}
          <span className="text-[#3A4252]">/</span>{" "}
          <span className="text-[#EDEFF3]">{ticket.title}</span>
        </nav>

        <div className="panel-card overflow-hidden rise-in">
          {/* Header section with torn bottom */}
          <div className="p-6 md:p-8 border-b border-[#2A3240] torn-bottom">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="font-display text-2xl font-bold tracking-tight">{ticket.title}</h1>
              <Stamp label={meta.label} color={meta.color} />
            </div>
            <p className="text-sm text-muted leading-relaxed">{ticket.description}</p>
          </div>

          {/* Body section */}
          <div className="p-6 md:p-8 pt-7 space-y-7">
            {/* From / To */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <p className="field-label mb-1">From</p>
                <p className="text-[15px]">{ticket.from}</p>
              </div>
              <div>
                <p className="field-label mb-1">To</p>
                <p className="text-[15px]">{ticket.to}</p>
              </div>
            </div>

            {/* Deadline / Starts at / Ends at */}
            <div className="grid sm:grid-cols-3 gap-5 pt-5 border-t border-dashed border-[#2A3240]">
              <div>
                <p className="field-label mb-1">Deadline</p>
                <p className="text-[15px] font-mono">{fmtDate(ticket.deadline)}</p>
              </div>
              <div>
                <p className="field-label mb-1">Starts at</p>
                <p className="text-[15px] font-mono">{fmtDate(ticket.startsAt)}</p>
              </div>
              <div>
                <p className="field-label mb-1">Ends at</p>
                <p className="text-[15px] font-mono">
                  {ticket.endsAt ? fmtDate(ticket.endsAt) : "— auto-set on completion —"}
                </p>
              </div>
            </div>

            {/* Agent description */}
            <div className="pt-5 border-t border-dashed border-[#2A3240]">
              <p className="field-label mb-2">
                Description <span className="normal-case text-[#5B6478]">(for the agent)</span>
              </p>
              <p className="text-[14.5px] leading-relaxed text-[#D7DAE2] whitespace-pre-wrap">
                {ticket.agentDescription || "—"}
              </p>
            </div>

            {/* Arabic description (optional, RTL) */}
            {ticket.arabicDescription && (
              <div className="pt-5 border-t border-dashed border-[#2A3240]" dir="rtl">
                <p className="field-label mb-2" dir="ltr">
                  Arabic description{" "}
                  <span className="normal-case text-[#5B6478]">(for the developer)</span>
                </p>
                <p className="text-[14.5px] leading-relaxed text-[#D7DAE2] whitespace-pre-wrap">
                  {ticket.arabicDescription}
                </p>
              </div>
            )}

            {/* Employee status change UI */}
            <div className="pt-5 border-t border-dashed border-[#2A3240]">
              <FieldLabel>Update status</FieldLabel>
              <p className="text-[11px] text-muted mb-2">
                You can set the status to "Still Working on it..." or "Completed".
                Ends-at is set automatically when completed.
              </p>
              <div className="flex gap-2">
                {EMPLOYEE_ALLOWED_STATUSES.map((status) => {
                  const statusMeta = STATUS_META[status];
                  const isActive = ticket.status === status;
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`btn border-2 transition ${
                        isActive
                          ? "bg-transparent"
                          : "bg-[#212938] border-[#2A3240] text-[#EDEFF3] hover:brightness-110"
                      }`}
                      style={
                        isActive
                          ? { borderColor: statusMeta.color, color: statusMeta.color }
                          : undefined
                      }
                    >
                      {statusMeta.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Download button */}
            <div className="pt-5 border-t border-dashed border-[#2A3240] flex justify-end">
              <Button variant="amber" onClick={handleDownload}>
                ⬇ DOWNLOAD TICKET (.md)
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}