# Security Alerts Management

A React-based web application for viewing and managing security alerts.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **React Router v6** for client-side routing
- **TanStack Query** for data fetching and caching
- **Material UI (MUI)** for UI components
- **Tailwind CSS** for utility-first styling
- **Radix UI** for accessible primitives

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
npm run dev
```

The app will be available at `http://localhost:5173`.

### Generate mock data

```bash
node generate-data.mjs
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Lint source files |
| `npm run format` | Format source files with Prettier |

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
