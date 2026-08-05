"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { FieldLabel } from "@/components/FieldLabel";
import { Modal } from "@/components/Modal";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { EmptyRow } from "@/components/EmptyState";
import { Stamp } from "@/components/Stamp";
import { getProjects, saveProjects, getTickets, saveTickets } from "@/lib/storage";
import { uid, todayISO, fmtDate } from "@/lib/utils";
import type { Project } from "@/lib/types";

interface ProjectsTabProps {
  /** Called after any mutation to notify the parent. */
  onRefresh: () => void;
}

export function ProjectsTab({ onRefresh }: ProjectsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);

  // Read projects fresh on every render
  const projects = getProjects();

  const openForm = (project: Project | null) => {
    setEditing(project);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const toggleClosed = (id: string) => {
    const all = getProjects();
    const idx = all.findIndex((p) => p.id === id);
    if (idx === -1) return;
    all[idx] = { ...all[idx], closed: !all[idx].closed };
    saveProjects(all);
    onRefresh();
  };

  const handleDelete = (id: string) => {
    saveProjects(getProjects().filter((p) => p.id !== id));
    // Also remove tickets belonging to this project
    saveTickets(getTickets().filter((t) => t.projectId !== id));
    setDeleteTarget(null);
    onRefresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Button variant="amber" onClick={() => openForm(null)}>
          + NEW PROJECT
        </Button>
      </div>
      <div className="space-y-3">
        {projects.length === 0 ? (
          <EmptyRow message="No projects yet. Create the first one above." />
        ) : (
          projects.map((p) => (
            <div
              key={p.id}
              className={`panel-card p-5 flex items-center justify-between gap-4 flex-wrap ${
                p.closed ? "opacity-60" : ""
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-[15px] truncate">{p.title}</h3>
                  {p.closed && <Stamp label="Closed" color="#C1503F" />}
                </div>
                <p className="text-[13px] text-muted mt-1 truncate max-w-lg">{p.description}</p>
                <p className="text-[11px] font-mono text-muted mt-1.5">
                  Start {fmtDate(p.startedAt)} · Due {fmtDate(p.expectedEndAt)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="panel-amber" className="text-xs" onClick={() => openForm(p)}>
                  EDIT
                </Button>
                <Button variant="panel-slate" className="text-xs" onClick={() => toggleClosed(p.id)}>
                  {p.closed ? "REOPEN" : "CLOSE"}
                </Button>
                <Button
                  variant="panel-red"
                  className="text-xs"
                  onClick={() => setDeleteTarget(p)}
                >
                  DELETE
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <ProjectForm
          project={editing}
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
   Project form modal (create / edit)
----------------------------------------------------------------- */

function ProjectForm({
  project,
  onClose,
  onSaved,
}: {
  project: Project | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!project;
  const [title, setTitle] = useState(project?.title ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [startedAt, setStartedAt] = useState(project?.startedAt ?? todayISO());
  const [expectedEndAt, setExpectedEndAt] = useState(project?.expectedEndAt ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const projects = getProjects();

    if (isEdit && project) {
      const idx = projects.findIndex((p) => p.id === project.id);
      if (idx === -1) return;
      projects[idx] = {
        ...projects[idx],
        title: title.trim(),
        description: description.trim(),
        startedAt,
        expectedEndAt,
      };
    } else {
      projects.push({
        id: uid("p"),
        title: title.trim(),
        description: description.trim(),
        startedAt,
        expectedEndAt,
        closed: false,
      });
    }

    saveProjects(projects);
    onSaved();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-xl font-bold mb-5">
        {isEdit ? "Edit project" : "New project"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel>Title</FieldLabel>
          <input
            type="text"
            placeholder="e.g. Website Redesign"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Description</FieldLabel>
          <textarea
            rows={3}
            placeholder="What is this project about?"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel>Started at</FieldLabel>
            <input
              type="date"
              required
              value={startedAt}
              onChange={(e) => setStartedAt(e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Expected end at</FieldLabel>
            <input
              type="date"
              required
              value={expectedEndAt}
              onChange={(e) => setExpectedEndAt(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="panel" onClick={onClose}>
            CANCEL
          </Button>
          <Button type="submit" variant="amber">
            {isEdit ? "SAVE CHANGES" : "CREATE PROJECT"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}