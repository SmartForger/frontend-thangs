import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    AnchorButton: {
      ...theme.mixins.text.linkText,
      margin: 0,
      padding: 0,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
  }
})

export const AnchorButton = ({ children, className, ...props }) => {
  const c = useStyles(props)
  return <button className={classnames(className, c.AnchorButton)}>{children}</button>
}
