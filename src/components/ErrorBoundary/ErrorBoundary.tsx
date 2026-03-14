import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface IProps {
  children: ReactNode
  fallback?: ReactNode
}

interface IState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): IState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-500" aria-hidden="true" strokeWidth={1.5} />
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">Application Error</h1>
          <p className="mb-1 text-sm text-gray-500">An unexpected error occurred.</p>
          {this.state.error && (
            <p className="mb-6 font-mono text-xs text-red-500">{this.state.error.message}</p>
          )}
          <Button variant="primary" onClick={this.reset}>
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
