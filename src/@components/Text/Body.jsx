import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'

const useStyles = createUseStyles(theme => {
  return {
    BodyText: {
      ...theme.text.bodyBase,
      display: 'inline',
      margin: 0,
      padding: 0,
      color: ({ light }) => (light ? theme.colors.white[100] : theme.colors.black[500]),
    },
    SingleLine: {
      fontSize: '1rem',
      lineHeight: '.75rem',
      whiteSpace: 'nowrap',
    },
    MultiLine: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
    },
  }
})

export const SingleLineBodyText = ({ children, className, light }) => {
  const c = useStyles({ light })
  return (
    <span className={classnames(className, c.BodyText, c.SingleLine)}>{children}</span>
  )
}

export const MultiLineBodyText = ({ children, className, light }) => {
  const c = useStyles({ light })
  return (
    <span className={classnames(className, c.BodyText, c.MultiLine)}>{children}</span>
  )
}
