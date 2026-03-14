import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { PageLayout } from '@/components/layout/PageLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <PageLayout>
          <Outlet />
        </PageLayout>
      </div>
    </ErrorBoundary>
  )
}
