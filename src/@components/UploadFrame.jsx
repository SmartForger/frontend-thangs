import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    UploadFrame: {
      width: '38.75rem',
      height: '35rem',
      backgroundColor: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      border: `1.5px dashed ${theme.colors.grey[100]}`,
      borderRadius: '1rem',
      cursor: ({ currentFile }) => (currentFile ? 'auto' : 'pointer'),
    },
  }
})

const UploadFrame = ({ children, className, ...props }) => {
  const c = useStyles(props)
  return <div className={classnames(className, c.UploadFrame)}>{children}</div>
}

export default UploadFrame
