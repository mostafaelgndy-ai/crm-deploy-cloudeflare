# 89273 — From Prototype to Real

> **Ticket:** `.plan\Agent\TICKET\from-prototype-to-real\89273-from-prototype-to-real.txt`
> **Date:** 2026-08-04

---

## What This Ticket Wants

The ticket asks us to **convert a static HTML prototype** (`.plan\Prototype\index.html`) into a **production Next.js App Router application** that runs on **OpenNext (Cloudflare)**.

The prototype is a complete, self-contained internal ticket system called **OPS/DESK**. It uses:
- A single `index.html` file with inline JavaScript and Tailwind CSS (CDN)
- `localStorage` as a mock backend
- Hash-based routing (`#/`, `#/login`, `#/project/ID`, `#/ticket/ID`, `#/admin`)

The target project is a fresh `create-next-app` with:
- **Next.js 16.2.10** (App Router)
- **React 19.2.4**
- **Tailwind CSS v4** (CSS-based config, not JS config)
- **@opennextjs/cloudflare** for deployment
- Currently only contains default boilerplate (`layout.tsx`, `page.tsx`, `globals.css`)

---

## What the Prototype Does (Feature Summary)

### Employee Side
1. **Login** (`#/login`): Username + numeric password (4+ digits). Validates against employee records in `localStorage`.
2. **Project Board** (`#/`): Grid of project "stub cards" (ticket-stub design). Closed projects appear greyed out and are not clickable.
3. **Project Tickets** (`#/project/:id`): Grid of ticket stub cards for the selected project. Closed tickets are not clickable.
4. **Ticket Detail** (`#/ticket/:id`): Full ticket view with From/To, Deadline/StartsAt/EndsAt, status stamp, agent description, optional Arabic description (RTL), and a **Download as .md** button (downloads only the agent description).

### Admin Side
5. **Admin Login** (`#/admin`): Hardcoded credentials (`mostafa_elgondy` / `6789yuio#Y`). "Remember me" persists the session.
6. **Admin Dashboard** (`#/admin` when authed): Three tabs:
   - **Projects**: Create, edit, close/reopen, delete (with "confirm" typed confirmation) projects.
   - **Tickets**: Create, edit, delete tickets. Filterable by project. Status can be set to any of the 4 statuses. StartsAt auto-set on creation; EndsAt auto-set when status becomes completed/closed.
   - **Employees**: Create, edit, delete employee accounts (username + numeric password).

### Design System
- **Colors**: Dark theme — ink (#14181F), panel (#1B212B), panel2 (#212938), border (#2A3240), paper (#F1E9D8), amber (#E8A33D), green (#4F9D69), red (#C1503F), muted (#7C8598)
- **Fonts**: Space Grotesk (display), IBM Plex Mono (mono), Inter (body)
- **Custom CSS**: stub-card, stub-strip, stub-divider, stamp, panel-card, torn-bottom, rise-in animation, modal-backdrop, field-label, btn, custom scrollbar, dotted background pattern

### Data Model
- **Project**: `{ id, title, description, startedAt, expectedEndAt, closed }`
- **Ticket**: `{ id, projectId, title, description, from, to, deadline, startsAt, endsAt, status, agentDescription, arabicDescription }`
- **Employee**: `{ username, password }`
- **Status**: `pending | onGoing | completed | closed` (each with label + color)
- **Admin**: Hardcoded `{ username: "mostafa_elgondy", password: "6789yuio#Y" }`

---

## What Needs to Happen

1. **Routing**: Convert hash-based routing to Next.js App Router file-system routing (`/`, `/login`, `/project/[id]`, `/ticket/[id]`, `/admin`).
2. **Styling**: Convert Tailwind v3 CDN config to Tailwind v4 CSS-based `@theme` in `globals.css`. Port all custom CSS classes. Load fonts via `next/font/google`.
3. **Component Architecture**: Break the monolithic HTML/JS into React components (TopBar, StubCard, Stamp, Modal, forms, admin tabs, etc.).
4. **Data Layer**: Create a typed data layer. The prototype uses `localStorage`; the README mentions "backend (ClaudeFlare OpenNext)". Initially use `localStorage` (matching prototype) with a clean abstraction that can be swapped for API routes later.
5. **Auth**: Client-side auth using `localStorage` sessions (matching prototype). Route protection via client-side redirects.
6. **State Management**: Most pages are interactive (forms, modals, tabs, CRUD) → primarily Client Components.
7. **TypeScript**: Add proper types for all data models and component props.

---

## Key Constraints

- Must use **Next.js App Router** conventions (not Pages Router)
- Must use **Tailwind CSS v4** (already installed, CSS-based config)
- Must deploy via **@opennextjs/cloudflare**
- `params` in dynamic routes is now a **Promise** that must be awaited (Next.js 16 breaking change)
- `PageProps<'/route'>` and `LayoutProps<'/route'>` are global type helpers
- Use `next/font/google` for font loading (not CDN `<link>`)
- Use `next/link` for navigation (not `<a href="#/...">`)