import React from 'react'
import { createUseStyles } from '@style'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    Signup_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
  }
})

const FormError = ({ className, children }) => {
  const c = useStyles({})
  return (
    <h4 className={classnames(className, c.Signup_ErrorText)} data-cy='form-error'>
      {children}
    </h4>
  )
}

export default FormError
