import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'
import classnames from 'classnames'

const useStyles = createUseStyles(theme => {
  return {
    ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
    },
  }
})

const FormError = ({ className, children, dataCy = 'form-error' }) => {
  const c = useStyles({})
  return (
    <h4 className={classnames(className, c.ErrorText)} data-cy={dataCy}>
      {children}
    </h4>
  )
}

export default FormError
