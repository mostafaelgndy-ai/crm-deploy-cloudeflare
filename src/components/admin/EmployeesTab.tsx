"use client";

import { useState } from "react";
import { Button } from "@/components/Button";
import { FieldLabel } from "@/components/FieldLabel";
import { Modal } from "@/components/Modal";
import { DeleteConfirm } from "@/components/DeleteConfirm";
import { EmptyRow } from "@/components/EmptyState";
import { getEmployees, saveEmployees } from "@/lib/storage";
import type { Employee } from "@/lib/types";

interface EmployeesTabProps {
  /** Called after any mutation to notify the parent. */
  onRefresh: () => void;
}

export function EmployeesTab({ onRefresh }: EmployeesTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const employees = getEmployees();

  const openForm = (employee: Employee | null) => {
    setEditing(employee);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (username: string) => {
    saveEmployees(getEmployees().filter((e) => e.username !== username));
    setDeleteTarget(null);
    onRefresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <Button variant="amber" onClick={() => openForm(null)}>
          + NEW EMPLOYEE
        </Button>
      </div>
      <div className="space-y-3">
        {employees.length === 0 ? (
          <EmptyRow message="No employees yet. Add the first account above." />
        ) : (
          employees.map((e) => (
            <div
              key={e.username}
              className="panel-card p-5 flex items-center justify-between gap-4 flex-wrap"
            >
              <div className="min-w-0">
                <h3 className="font-display font-semibold text-[15px]">{e.username}</h3>
                <p className="text-[12px] font-mono text-muted mt-1">
                  password: {"•".repeat(e.password.length)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="panel-amber" className="text-xs" onClick={() => openForm(e)}>
                  EDIT
                </Button>
                <Button
                  variant="panel-red"
                  className="text-xs"
                  onClick={() => setDeleteTarget(e)}
                >
                  DELETE
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <EmployeeForm
          employee={editing}
          onClose={closeForm}
          onSaved={() => {
            closeForm();
            onRefresh();
          }}
        />
      )}

      {deleteTarget && (
        <DeleteConfirm
          title={deleteTarget.username}
          onConfirm={() => handleDelete(deleteTarget.username)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

/* ----------------------------------------------------------------
   Employee form modal (create / edit)
----------------------------------------------------------------- */

function EmployeeForm({
  employee,
  onClose,
  onSaved,
}: {
  employee: Employee | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!employee;
  const [username, setUsername] = useState(employee?.username ?? "");
  const [password, setPassword] = useState(employee?.password ?? "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!/^\d{4,}$/.test(password.trim())) {
      setError("Password must be at least 4 numbers.");
      return;
    }

    const employees = getEmployees();
    const clash = employees.find(
      (emp) => emp.username === username.trim() && (!isEdit || emp.username !== employee?.username),
    );

    if (clash) {
      setError("That username is already taken.");
      return;
    }

    if (isEdit && employee) {
      const idx = employees.findIndex((emp) => emp.username === employee.username);
      if (idx === -1) return;
      employees[idx] = { username: username.trim(), password: password.trim() };
    } else {
      employees.push({ username: username.trim(), password: password.trim() });
    }

    saveEmployees(employees);
    onSaved();
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-xl font-bold mb-5">
        {isEdit ? "Edit employee" : "New employee"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <FieldLabel>Username</FieldLabel>
          <input
            type="text"
            placeholder="e.g. youssef.dev"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Password</FieldLabel>
          <input
            type="text"
            placeholder="At least 4 numbers"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="panel" onClick={onClose}>
            CANCEL
          </Button>
          <Button type="submit" variant="amber">
            {isEdit ? "SAVE CHANGES" : "ADD EMPLOYEE"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}