# Security Alerts Management

A React-based web application for viewing and managing security alerts.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router v6** for client-side routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for utility-first styling

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
7
```

The app will be available at `http://localhost:5173`.

### Generate mock data

```bash
node generate-data.mjs
```

## Scripts

| Command              | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start development server            |
| `npm run build`      | Type-check and build for production |
| `npm run preview`    | Preview the production build        |
| `npm run test`       | Run tests once                      |
| `npm run test:watch` | Run tests in watch mode             |
| `npm run lint`       | Lint source files                   |
| `npm run format`     | Format source files with Prettier   |

## Architecture

Data flows in one direction through four layers:

```
alertsService  →  hooks  →  pages (containers)  →  components (presentational)
```

- **`alertsService`** — the data layer. All API calls go here. Currently backed by static JSON with simulated latency; swap the implementations to connect a real API without touching any other layer.
- **`hooks`** — wrap React Query calls around the service functions. They own caching, loading, and error state. Pages never call the service directly.
- **`pages`** — container components (`AlertsListPage`, `AlertDetailPage`). They compose hooks and pass data down as props. No fetch logic lives here.
- **`components`** — purely presentational. `AlertTable`, `AlertRow`, etc. receive data via props and emit events via callbacks.

### Filter & sort state

All filter, sort, and pagination state is stored in **URL search params** via `useFilters`. This means every view is shareable and bookmarkable, and the browser back button works correctly. `useFilters` is the single source of truth — nothing is duplicated in React state.

### Column definition pattern

Table columns are defined as data in `alertColumns.tsx`, not as JSX. Each column owns its header metadata and its cell renderer. `AlertTable` and `AlertRow` consume this config, keeping structure and rendering logic in one place and avoiding prop drilling.

## Project Structure

```
src/
├── pages/          # Route-level page components
│   ├── AlertsListPage.tsx
│   └── AlertDetailPage.tsx
├── components/     # Reusable UI components
│   ├── alerts/
│   ├── layout/
│   └── ui/
├── hooks/          # Custom React hooks
├── services/       # API/data service layer
├── data/           # Static or generated mock data
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── lib/            # Third-party library configuration
└── router/         # Route definitions
```
