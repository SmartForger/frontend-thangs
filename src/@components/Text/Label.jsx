import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    LabelText: {
      ...theme.text.labelBase,
      display: 'flex',
      alignItems: 'center',
      margin: 0,
      padding: 0,
      fontSize: ({ small }) => (small ? '.875rem' : '1rem'),
      lineHeight: ({ small }) => (small ? '.875rem' : '1rem'),
    },
  }
})

export const LabelText = ({ children, className, small }) => {
  const c = useStyles({ small })
  return <p className={classnames(className, c.LabelText)}>{children}</p>
}
