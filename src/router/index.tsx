import { createBrowserRouter, Navigate } from 'react-router-dom'
import App from '@/App'
import { AlertsListPage } from '@/pages/AlertsListPage'
import { AlertDetailPage } from '@/pages/AlertDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/alerts" replace /> },
      { path: 'alerts', element: <AlertsListPage /> },
      { path: 'alerts/:id', element: <AlertDetailPage /> },
    ],
  },
])
