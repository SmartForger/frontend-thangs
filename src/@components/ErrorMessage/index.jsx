import React from 'react'
import { Spacer } from '@components'

const ErrorMessage = ({ message }) => {
  return (
    <>
      <h4 data-cy='edit-model-error'>{message}</h4>
      <Spacer size='1rem' />
    </>
  )
}

export default ErrorMessage
