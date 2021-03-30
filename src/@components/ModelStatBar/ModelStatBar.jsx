import React from 'react'
import { FormError, Spacer, Spinner } from '@components'

const ModelStatBar = ({ modelData = {}, isLoading, isError, error }) => {
  if (isLoading) return <Spinner />
  if (isError) {
    return (
      <>
        <FormError message={error} />
        <Spacer size='1rem' />
      </>
    )
  }

  return (
    <React.Fragment>
      <Spacer size={'1.5rem'} />
      MODEL stats
      <Spacer size={'1.5rem'} />
    </React.Fragment>
  )
}

ModelStatBar.displayName = 'ModelStatBar'

export default ModelStatBar
