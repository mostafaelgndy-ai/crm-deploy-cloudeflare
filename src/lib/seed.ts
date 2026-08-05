import { LS_KEYS } from "./constants";
import { load, save } from "./storage";
import type { Project, Ticket, Employee } from "./types";

/** Initial seed projects (3). */
const SEED_PROJECTS: Project[] = [
  {
    id: "p1",
    title: "Website Redesign",
    description:
      "Rebuilding the marketing site on the new design system, section by section.",
    startedAt: "2026-05-01",
    expectedEndAt: "2026-08-15",
    closed: false,
  },
  {
    id: "p2",
    title: "Mobile App v2",
    description:
      "Second major release of the internal field-ops mobile app.",
    startedAt: "2026-04-10",
    expectedEndAt: "2026-09-30",
    closed: false,
  },
  {
    id: "p3",
    title: "Payment Gateway Migration",
    description:
      "Moving all billing off the legacy processor to the new provider.",
    startedAt: "2026-02-01",
    expectedEndAt: "2026-06-01",
    closed: true,
  },
];

/** Initial seed tickets (6). */
const SEED_TICKETS: Ticket[] = [
  {
    id: "t1",
    projectId: "p1",
    title: "Fix hero section spacing",
    description:
      "Spacing looks off between the hero and the nav on smaller screens.",
    from: "Mostafa Elgondy",
    to: "Youssef Adel",
    deadline: "2026-08-10",
    startsAt: "2026-06-02",
    endsAt: null,
    status: "onGoing",
    agentDescription:
      "Reduce the top padding of the hero section to 64px on viewports under 768px, and confirm the nav no longer overlaps the headline on iPhone SE and iPhone 14 widths.",
    arabicDescription:
      "قلل الحشو العلوي لقسم الهيرو إلى 64 بكسل على الشاشات الأصغر من 768 بكسل، وتأكد من عدم تداخل شريط التنقل مع العنوان.",
  },
  {
    id: "t2",
    projectId: "p1",
    title: "Add newsletter signup form",
    description: "Marketing wants an email capture block above the footer.",
    from: "Mostafa Elgondy",
    to: "Sara Hossam",
    deadline: "2026-07-20",
    startsAt: "2026-06-05",
    endsAt: null,
    status: "pending",
    agentDescription:
      "Add a two-field form (name, email) above the footer that posts to the /subscribe endpoint and shows a success state inline.",
    arabicDescription: "",
  },
  {
    id: "t3",
    projectId: "p1",
    title: "Optimize hero image",
    description: "Hero image is 4.2MB and slowing first paint.",
    from: "Youssef Adel",
    to: "Mostafa Elgondy",
    deadline: "2026-06-15",
    startsAt: "2026-05-20",
    endsAt: "2026-06-10",
    status: "completed",
    agentDescription:
      "Compress and serve the hero image as WebP with a JPEG fallback, target under 200KB without visible quality loss.",
    arabicDescription:
      "ضغط صورة الهيرو وتقديمها بصيغة WebP مع نسخة احتياطية JPEG، بحد أقصى 200 كيلوبايت.",
  },
  {
    id: "t4",
    projectId: "p2",
    title: "Push notification permission flow",
    description: "Users are dismissing the permission prompt too early.",
    from: "Mostafa Elgondy",
    to: "Sara Hossam",
    deadline: "2026-08-01",
    startsAt: "2026-06-01",
    endsAt: null,
    status: "onGoing",
    agentDescription:
      "Add a soft pre-permission screen explaining why notifications matter before triggering the native OS prompt.",
    arabicDescription: "",
  },
  {
    id: "t5",
    projectId: "p2",
    title: "Offline mode for ticket list",
    description: "App should cache the last ticket list for offline viewing.",
    from: "Mostafa Elgondy",
    to: "Youssef Adel",
    deadline: "2026-09-10",
    startsAt: "2026-07-01",
    endsAt: null,
    status: "pending",
    agentDescription:
      'Cache the most recent successful ticket list response and render it with an "offline copy" banner when the network request fails.',
    arabicDescription: "",
  },
  {
    id: "t6",
    projectId: "p3",
    title: "Disable legacy webhook",
    description: "Old processor webhook should be turned off after cutover.",
    from: "Mostafa Elgondy",
    to: "Youssef Adel",
    deadline: "2026-06-01",
    startsAt: "2026-05-01",
    endsAt: "2026-05-30",
    status: "closed",
    agentDescription:
      "Remove the legacy webhook subscription from the old processor dashboard and archive its logs before decommissioning.",
    arabicDescription: "",
  },
];

/** Initial seed employees (2). */
const SEED_EMPLOYEES: Employee[] = [
  { username: "youssef.dev", password: "2468" },
  { username: "sara.qa", password: "1357" },
];

/**
 * Seed localStorage with initial data on first visit.
 * Only writes if the key doesn't already exist.
 */
export function seedData(): void {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem(LS_KEYS.projects)) {
    save(LS_KEYS.projects, SEED_PROJECTS);
  }
  if (!localStorage.getItem(LS_KEYS.tickets)) {
    save(LS_KEYS.tickets, SEED_TICKETS);
  }
  if (!localStorage.getItem(LS_KEYS.employees)) {
    save(LS_KEYS.employees, SEED_EMPLOYEES);
  }
}

// Re-export for convenience in components that need raw seed arrays
export { SEED_PROJECTS, SEED_TICKETS, SEED_EMPLOYEES };