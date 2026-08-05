"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { FieldLabel } from "@/components/FieldLabel";
import { Modal } from "@/components/Modal";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { EmptyRow } from "@/components/EmptyState";
import { Stamp } from "@/components/Stamp";
import { getProjects, getTickets, saveTickets } from "@/lib/storage";
import { STATUS_META, ALL_STATUSES, ADMIN } from "@/lib/constants";
import { uid, todayISO, fmtDate } from "@/lib/utils";
import type { Ticket, Project, TicketStatus } from "@/lib/types";

interface TicketsTabProps {
  /** Called after any mutation to notify the parent. */
  onRefresh: () => void;
}

export function TicketsTab({ onRefresh }: TicketsTabProps) {
  const [projectFilter, setProjectFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Ticket | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Ticket | null>(null);

  const projects = getProjects();
  const tickets = getTickets();
  const filtered =
    projectFilter === "all" ? tickets : tickets.filter((t) => t.projectId === projectFilter);

  const openForm = (ticket: Ticket | null) => {
    setEditing(ticket);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    saveTickets(getTickets().filter((t) => t.id !== id));
    setDeleteTarget(null);
    onRefresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <select
          className="max-w-xs"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
        >
          <option value="all">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
        <Button
          variant="amber"
          onClick={() => openForm(null)}
          disabled={projects.length === 0}
        >
          + NEW TICKET
        </Button>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyRow
            message={
              projects.length === 0
                ? "Create a project first, then add tickets to it."
                : "No tickets match this filter."
            }
          />
        ) : (
          filtered.map((t) => {
            const meta = STATUS_META[t.status];
            const project = projects.find((p) => p.id === t.projectId);
            return (
              <div
                key={t.id}
                className="panel-card p-5 flex items-center justify-between gap-4 flex-wrap"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-[15px] truncate">{t.title}</h3>
                    <Stamp label={meta.label} color={meta.color} />
                  </div>
                  <p className="text-[13px] text-muted mt-1 truncate max-w-lg">{t.description}</p>
                  <p className="text-[11px] font-mono text-muted mt-1.5">
                    {project ? project.title : "Unassigned"} · From {t.from} → {t.to} · Due{" "}
                    {fmtDate(t.deadline)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="panel-amber"
                    className="text-xs"
                    onClick={() => openForm(t)}
                  >
                    EDIT
                  </Button>
                  <Button
                    variant="panel-red"
                    className="text-xs"
                    onClick={() => setDeleteTarget(t)}
                  >
                    DELETE
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showForm && (
        <TicketForm
          ticket={editing}
          projects={projects}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            onRefresh();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.title}
          onConfirm={() => handleDelete(deleteTarget.id)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Ticket form modal (create / edit)
----------------------------------------------------------------- */

function TicketForm({
  ticket,
  projects,
  onClose,
  onSaved,
}: {
  ticket: Ticket | null;
  projects: Project[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!ticket;
  const [projectId, setProjectId] = useState(ticket?.projectId ?? projects[0]?.id ?? "");
  const [title, setTitle] = useState(ticket?.title ?? "");
  const [description, setDescription] = useState(ticket?.description ?? "");
  const [from, setFrom] = useState(ticket?.from ?? ADMIN.username);
  const [to, setTo] = useState(ticket?.to ?? "");
  const [deadline, setDeadline] = useState(ticket?.deadline ?? "");
  const [status, setStatus] = useState<TicketStatus>(ticket?.status ?? "pending");
  const [agentDescription, setAgentDescription] = useState(ticket?.agentDescription ?? "");
  const [arabicDescription, setArabicDescription] = useState(ticket?.arabicDescription ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tickets = getTickets();

    if (isEdit && ticket) {
      const idx = tickets.findIndex((t) => t.id === ticket.id);
      if (idx === -1) return;
      const prevStatus = tickets[idx].status;
      let endsAt = tickets[idx].endsAt;

      // Auto-set endsAt when status first becomes completed or closed
      if ((status === "completed" || status === "closed") && !endsAt) {
        endsAt = todayISO();
      }
      // Keep history — don't clear endsAt when moving away from completed/closed
      if (status !== "completed" && status !== "closed" && prevStatus !== status) {
        endsAt = tickets[idx].endsAt;
      }

      tickets[idx] = {
        ...tickets[idx],
        projectId,
        title: title.trim(),
        description: description.trim(),
        from: from.trim(),
        to: to.trim(),
        deadline,
        status,
        agentDescription: agentDescription.trim(),
        arabicDescription: arabicDescription.trim(),
        endsAt,
      };
    } else {
      tickets.push({
        id: uid("t"),
        projectId,
        title: title.trim(),
        description: description.trim(),
        from: from.trim(),
        to: to.trim(),
        deadline,
        startsAt: todayISO(),
        endsAt: status === "completed" || status === "closed" ? todayISO() : null,
        status,
        agentDescription: agentDescription.trim(),
        arabicDescription: arabicDescription.trim(),
      });
    }

    saveTickets(tickets);
    onSaved();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-xl font-bold mb-5">
        {isEdit ? "Edit ticket" : "New ticket"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[65vh] overflow-y-auto pr-1">
        <div>
          <FieldLabel>Project</FieldLabel>
          <select
            required
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel>Title</FieldLabel>
          <input
            type="text"
            placeholder="e.g. Fix hero section spacing"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>
            Short description <span className="normal-case text-[#5B6478]">(shown on the card)</span>
          </FieldLabel>
          <textarea
            rows={2}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>From</FieldLabel>
            <input
              type="text"
              required
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>To</FieldLabel>
            <input
              type="text"
              placeholder="Assignee name"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Deadline</FieldLabel>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Status</FieldLabel>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TicketStatus)}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-muted mt-1.5">
            Starts-at is set automatically on creation. Ends-at is set automatically the first time
            status becomes Completed or Closed.
          </p>
        </div>
        <div>
          <FieldLabel>
            Description <span className="normal-case text-[#5B6478]">(for the agent)</span>
          </FieldLabel>
          <textarea
            rows={3}
            required
            value={agentDescription}
            onChange={(e) => setAgentDescription(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>
            Arabic description{" "}
            <span className="normal-case text-[#5B6478]">(for the developer, optional)</span>
          </FieldLabel>
          <textarea
            rows={3}
            dir="rtl"
            value={arabicDescription}
            onChange={(e) => setArabicDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-end gap-2 pt-2 sticky bottom-0 bg-[#1B212B]">
          <Button type="button" variant="panel" onClick={onClose}>
            CANCEL
          </Button>
          <Button type="submit" variant="amber">
            {isEdit ? "SAVE CHANGES" : "CREATE TICKET"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}