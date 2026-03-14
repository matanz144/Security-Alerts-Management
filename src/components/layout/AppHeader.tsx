import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AppHeader = () => {
  return (
    <header className="border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-screen-xl items-center gap-3 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <ShieldCheck className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <Link
          to="/alerts"
          className="text-lg font-bold tracking-tight text-gray-900 hover:text-indigo-600 transition-colors"
        >
          Security Alerts
        </Link>
      </div>
    </header>
  )
}
