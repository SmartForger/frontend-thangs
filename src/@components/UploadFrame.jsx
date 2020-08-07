import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    UploadFrame: {
      height: '35rem',
      backgroundColor: ({ dragactive }) =>
        dragactive ? theme.colors.white[800] : theme.colors.white[400],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      cursor: ({ currentFile }) => (currentFile ? 'auto' : 'pointer'),
    },
  }
})

const UploadFrame = ({ children, className, ...props }) => {
  const c = useStyles(props)
  return <div className={classnames(className, c.UploadFrame)}>{children}</div>
}

export default UploadFrame
