import { LS_KEYS } from "./constants";
import type { Project, Ticket, Employee, EmployeeSession, TicketStatus } from "./types";
import { todayISO } from "./utils";

/* ----------------------------------------------------------------
   Generic localStorage helpers (with SSR guard)
----------------------------------------------------------------- */

/** Save a value to localStorage as JSON. No-op on the server. */
export function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

/** Load and parse a JSON value from localStorage, returning fallback on error. */
export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return v ?? fallback;
  } catch {
    return fallback;
  }
}

/* ----------------------------------------------------------------
   Project CRUD
----------------------------------------------------------------- */

export function getProjects(): Project[] {
  return load<Project[]>(LS_KEYS.projects, []);
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function saveProjects(projects: Project[]): void {
  save(LS_KEYS.projects, projects);
}

/* ----------------------------------------------------------------
   Ticket CRUD
----------------------------------------------------------------- */

export function getTickets(): Ticket[] {
  return load<Ticket[]>(LS_KEYS.tickets, []);
}

export function getTicketsByProject(projectId: string): Ticket[] {
  return getTickets().filter((t) => t.projectId === projectId);
}

export function getTicket(id: string): Ticket | undefined {
  return getTickets().find((t) => t.id === id);
}

export function saveTickets(tickets: Ticket[]): void {
  save(LS_KEYS.tickets, tickets);
}

/**
 * Update a ticket's status. When the status first becomes `completed`
 * or `closed` and `endsAt` is null, it is auto-set to today's date.
 */
export function updateTicketStatus(id: string, status: TicketStatus): void {
  const tickets = getTickets();
  const idx = tickets.findIndex((t) => t.id === id);
  if (idx === -1) return;

  const ticket = tickets[idx];
  const shouldSetEndsAt =
    (status === "completed" || status === "closed") && !ticket.endsAt;

  tickets[idx] = {
    ...ticket,
    status,
    endsAt: shouldSetEndsAt ? todayISO() : ticket.endsAt,
  };
  saveTickets(tickets);
}

/* ----------------------------------------------------------------
   Employee CRUD
----------------------------------------------------------------- */

export function getEmployees(): Employee[] {
  return load<Employee[]>(LS_KEYS.employees, []);
}

export function saveEmployees(employees: Employee[]): void {
  save(LS_KEYS.employees, employees);
}

/* ----------------------------------------------------------------
   Employee session
----------------------------------------------------------------- */

export function getEmpSession(): EmployeeSession | null {
  return load<EmployeeSession | null>(LS_KEYS.empSession, null);
}

export function setEmpSession(session: EmployeeSession): void {
  save(LS_KEYS.empSession, session);
}

export function clearEmpSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEYS.empSession);
}

/* ----------------------------------------------------------------
   Admin session
----------------------------------------------------------------- */

export function isAdminAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(LS_KEYS.adminSession) === "1";
}

export function setAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LS_KEYS.adminSession, "1");
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEYS.adminSession);
}