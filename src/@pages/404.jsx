import React, { useEffect } from 'react'
import { Layout } from '@components'
import { pageview } from '@utilities/analytics'

export const Message404 = () => {
  return <h1>We couldn&apos;t find the page you&apos;re looking for. Sorry!</h1>
}

export const Page404 = () => {
  useEffect(() => {
    pageview('404')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Layout>
      <Message404 />
    </Layout>
  )
}
