import React from 'react'

const ErrorMessage = () => {
  return (
    <>
      <h4 className={c.EditModel_ErrorText} data-cy='edit-model-error'>
        {editProfileErrorMessage}
      </h4>
      <Spacer size='1rem' />
    </>
  )
}

export default ErrorMessage
