import type { TicketStatus, StatusMeta } from "./types";

/** localStorage key names — centralized for easy refactoring. */
export const LS_KEYS = {
  projects: "opsdesk_projects",
  tickets: "opsdesk_tickets",
  employees: "opsdesk_employees",
  empSession: "opsdesk_employee_session",
  adminSession: "opsdesk_admin_remember",
} as const;

/** Admin credentials (single admin account). */
export const ADMIN = {
  username: "mostafa_elgondy",
  password: "6789yuio#Y",
} as const;

/** Status metadata: label + color for each ticket status. */
export const STATUS_META: Record<TicketStatus, StatusMeta> = {
  pending: { label: "Pending", color: "#8791A6" },
  onGoing: { label: "Still Working on it...", color: "#E8A33D" },
  completed: { label: "Completed", color: "#4F9D69" },
  closed: { label: "Closed", color: "#C1503F" },
};

/** Statuses an employee is allowed to set on a ticket. */
export const EMPLOYEE_ALLOWED_STATUSES: TicketStatus[] = ["onGoing", "completed"];

/** All ticket statuses (for admin forms). */
export const ALL_STATUSES: TicketStatus[] = ["pending", "onGoing", "completed", "closed"];