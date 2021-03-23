import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'

const useStyles = createUseStyles(theme => {
  return {
    AnchorButton: {
      ...theme.text.linkText,
      margin: 0,
      padding: 0,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
  }
})

const AnchorButton = ({ children, className, onClick }) => {
  const c = useStyles({})
  return (
    <button className={classnames(className, c.AnchorButton)} onClick={onClick}>
      {children}
    </button>
  )
}

export default AnchorButton
