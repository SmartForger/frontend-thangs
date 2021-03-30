import React from 'react'
import { FormError, Spacer, Spinner } from '@components'

const ModelInfoBox = ({ modelData = {}, isLoading, isError, error }) => {
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
      MODEL INFO
      <Spacer size={'1.5rem'} />
    </React.Fragment>
  )
}

ModelInfoBox.displayName = 'ModelInfoBox'

export default ModelInfoBox
