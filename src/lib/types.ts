/**
 * Core domain types for the OPS/DESK ticket system.
 */

/** All possible ticket lifecycle statuses. */
export type TicketStatus = "pending" | "onGoing" | "completed" | "closed";

/** Metadata for rendering a status stamp (label + color). */
export interface StatusMeta {
  label: string;
  color: string;
}

/** A project that contains tickets. */
export interface Project {
  id: string;
  title: string;
  description: string;
  startedAt: string;
  expectedEndAt: string;
  closed: boolean;
}

/** A ticket belonging to a project. */
export interface Ticket {
  id: string;
  projectId: string;
  title: string;
  description: string;
  from: string;
  to: string;
  deadline: string;
  startsAt: string;
  endsAt: string | null;
  status: TicketStatus;
  agentDescription: string;
  arabicDescription: string;
}

/** An employee who can log in and view tickets. */
export interface Employee {
  username: string;
  password: string;
}

/** The stored employee session (after login). */
export interface EmployeeSession {
  username: string;
}