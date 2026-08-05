# OPS/DESK — Internal Ticket Management System

A Next.js-based internal ticket management system designed for team collaboration and project tracking. Built with modern web technologies and optimized for Cloudflare deployment.

## Tech Stack

- **Framework**: Next.js 16.2.10 (App Router)
- **Runtime**: React 19.2.4
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Deployment**: Cloudflare Pages via OpenNext.js
- **Data Storage**: Client-side localStorage (no backend database required)

## Features

### Employee Portal
- **Secure Authentication**: Login with username and numeric password (minimum 4 digits)
- **Project Board**: View all active projects with title, description, start date, and expected end date
- **Ticket Management**: Access tickets within each project
- **Ticket Details**: View comprehensive ticket information including:
  - From/To assignments
  - Deadline and timeline (auto-generated start/end dates)
  - Status tracking (Pending, On Going, Completed, Closed)
  - Agent description and optional Arabic description for developers
- **Status Updates**: Employees can update ticket status to "On Going" or "Completed"
- **Ticket Export**: Download tickets as Markdown files
- **Session Persistence**: Stay logged in across browser sessions

### Admin Dashboard
- **Project Management**: Create, edit, close, and delete projects
- **Ticket Management**: Full control over all tickets (create, edit, close, delete)
- **Employee Management**: Add, edit, and manage employee accounts
- **Status Control**: Admin can set any ticket status (Pending, On Going, Completed, Closed)
- **Visual Indicators**: Closed projects appear non-clickable on the employee board
- **Secure Access**: Protected admin area with hardcoded credentials

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview Cloudflare build locally |
| `npm run deploy` | Deploy to Cloudflare Pages |
| `npm run upload` | Upload to Cloudflare without deploying |
| `npm run cf-typegen` | Generate Cloudflare environment types |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with font configuration
│   ├── page.tsx            # Employee project board (/)
│   ├── login/              # Employee login page
│   ├── admin/              # Admin dashboard
│   ├── project/            # Project detail pages
│   └── ticket/             # Ticket detail pages
├── components/
│   ├── Button.tsx          # Reusable button component
│   ├── Modal.tsx           # Modal dialog component
│   ├── TopBar.tsx          # Navigation header
│   ├── StubCard.tsx        # Project/ticket card component
│   ├── Stamp.tsx           # Status badge component
│   ├── EmptyState.tsx      # Empty state placeholder
│   ├── FieldLabel.tsx      # Form field label
│   ├── DeleteConfirm.tsx   # Delete confirmation modal
│   └── admin/              # Admin-specific components
├── hooks/
│   └── useAuth.ts          # Authentication hook
├── lib/
│   ├── types.ts            # TypeScript type definitions
│   ├── storage.ts          # localStorage CRUD operations
│   ├── constants.ts        # App constants and configuration
│   ├── utils.ts            # Utility functions
│   └── seed.ts             # Initial data seeding
└── globals.css             # Global styles
```

## User Flows

### Employee Flow
1. Navigate to `/` → Auto-redirected to `/login`
2. Enter credentials (username + numeric password, min 4 digits)
3. View project board with all active projects
4. Click project card → View project tickets
5. Click ticket card → View ticket details
6. Update ticket status or download as Markdown

### Admin Flow
1. Navigate to `/admin`
2. Enter admin credentials:
   - Username: `mostafa_elgondy`
   - Password: `6789yuio#Y`
3. Manage projects, tickets, and employees via tabbed interface
4. All changes reflect immediately on the employee board

## Data Model

### Project
- `id`: Unique identifier
- `title`: Project name
- `description`: Project details
- `startedAt`: Start date (ISO format)
- `expectedEndAt`: Expected completion date
- `closed`: Boolean flag for project status

### Ticket
- `id`: Unique identifier
- `projectId`: Parent project reference
- `title`: Ticket title
- `description`: Ticket description
- `from`: Assigner name
- `to`: Assignee name
- `deadline`: Deadline date
- `startsAt`: Auto-generated start date
- `endsAt`: Auto-generated end date (set when completed/closed)
- `status`: Current status (pending/onGoing/completed/closed)
- `agentDescription`: Description for AI agents
- `arabicDescription`: Optional Arabic description for developers

### Employee
- `username`: Login username
- `password`: Numeric password (min 4 digits)

## Deployment

This project is configured for deployment on Cloudflare Pages using OpenNext.js:

```bash
# Build and preview locally
npm run preview

# Deploy to Cloudflare
npm run deploy
```

## Notes

- All data is stored in browser localStorage (no server-side database)
- Data persists across sessions but is browser-specific
- Admin credentials are hardcoded in `src/lib/constants.ts`
- The system uses client-side routing with Next.js App Router
- Responsive design optimized for desktop and mobile devices

## Development

This is a private internal tool. For questions or issues, contact your system administrator.

---

**Version**: 0.1.0  
**Status**: Active Development