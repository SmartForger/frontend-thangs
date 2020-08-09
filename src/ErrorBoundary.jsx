import React, { Component } from 'react'
import { Layout } from '@components'
import { logger } from '@utilities/logging'

function ErrorMessage() {
  return (
    <div>
      <h2>Oh no! Something went wrong on our end. Sorry about that!</h2>
      <div>Try refreshing the page. If you see this error again, please notify us.</div>
    </div>
  )
}

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // We should consider sending these errors to some logging service
    logger.error('Uncaught error:', error, '\nMore info:', errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout options={{ logoOnly: true }}>
          <ErrorMessage />
        </Layout>
      )
    }

    return this.props.children
  }
}
