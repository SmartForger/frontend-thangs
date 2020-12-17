import React from 'react'
import { ProgressText, UploadFrame, Loader } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    IconContainer: {
      height: '10.5rem',
      width: '10.5rem',
      marginTop: '9.5rem',
      textAlign: 'center',
    },
    Dots: {
      ...theme.text.uploadFrameText,
      color: theme.colors.purple[900],
      marginTop: '1.75rem',
      width: '12rem',
    },
    UploadFrame: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      width: '100%',
    },
  }
})

const UploadProgress = () => {
  const c = useStyles()
  return (
    <UploadFrame className={c.UploadFrame}>
      <Loader />
      <ProgressText text='Uploading' className={c.Dots} />
    </UploadFrame>
  )
}

export default UploadProgress
