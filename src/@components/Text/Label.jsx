import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'

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
      whiteSpace: 'nowrap',
    },
  }
})

export const LabelText = ({ children, className, small }) => {
  const c = useStyles({ small })
  return <span className={classnames(className, c.LabelText)}>{children}</span>
}
