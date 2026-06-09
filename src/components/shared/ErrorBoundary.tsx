'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="flex flex-col items-center justify-center min-h-dvh gap-4 p-8 text-center">
          <p className="text-gray-500">Something went wrong. Please refresh the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-full bg-rose-500 text-white px-6 py-2 text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
