import React from 'react'
import { NewThemeLayout } from '@components/Layout'

export const Message404 = () => {
  return <h1>We couldn&apos;t find the page you&apos;re looking for. Sorry!</h1>
}

export const Page404 = () => {
  return (
    <NewThemeLayout>
      <Message404 />
    </NewThemeLayout>
  )
}
