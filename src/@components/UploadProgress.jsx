import React from 'react'
import { ProgressText, UploadFrame } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    '@keyframes loading': {
      '25%': { borderRadius: '0 50% 50% 50%' },
      '50%': { borderRadius: '50% 0 50% 50%' },
      '75%': { borderRadius: '50% 50% 0 50%' },
    },
    IconContainer: {
      height: '10.5rem',
      width: '10.5rem',
      marginTop: '9.5rem',
      textAlign: 'center',
    },
    Dots: {
      ...theme.mixins.text.uploadFrameText,
      color: theme.colors.purple[900],
      marginTop: '1.75rem',
      textAlign: 'center',
      width: '16rem',
    },
    UploadFrame: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    UploadProgress_Loader: {
      position: 'relative',
      width: '3rem',
      height: '3rem',
      boxShadow: `inset 0 0 0 12px ${theme.colors.gold[500]}`,
      borderRadius: '50% 50% 50% 0',
      animation: '$loading 2s infinite',

      '&:after': {
        content: '"',
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        boxShadow: `inset 0 0 0 12px ${theme.colors.gold[500]}`,
        borderRadius: '50%',
      },
    },
  }
})

const UploadProgress = () => {
  const c = useStyles()
  return (
    <UploadFrame className={c.UploadFrame}>
      <div className={c.UploadProgress_Loader} />
      <ProgressText text='Uploading' className={c.Dots} />
    </UploadFrame>
  )
}

export default UploadProgress
