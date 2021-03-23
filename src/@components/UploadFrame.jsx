import React from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    UploadFrame: {
      height: '35rem',
      backgroundColor: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      borderRadius: '1rem',
      cursor: ({ currentFile }) => (currentFile ? 'auto' : 'pointer'),

      [md]: {
        border: `1.5px dashed ${theme.colors.grey[100]}`,
      },
    },
  }
})

const UploadFrame = ({ children, className, ...props }) => {
  const c = useStyles(props)
  return <div className={classnames(className, c.UploadFrame)}>{children}</div>
}

export default UploadFrame
