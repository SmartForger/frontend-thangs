import React, { useState, useEffect } from 'react'
import { ProgressText, UploadFrame } from '@components'
import { ReactComponent as CheckUploadingIcon } from '@svg/check-uploading-icon.svg'
import { ReactComponent as LensUploadingIcon } from '@svg/lens-uploading-icon.svg'
import { ReactComponent as GraphUploadingIcon } from '@svg/graph-uploading-icon.svg'
import { ReactComponent as RulerUploadingIcon } from '@svg/ruler-uploading-icon.svg'
import { ReactComponent as ProtractorUploadingIcon } from '@svg/protractor-uploading-icon.svg'
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
      marginBottom: '2rem',

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

const CHECK = 'check'
const LENS = 'lens'
const GRAPH = 'graph'
const RULER = 'ruler'
const PROTRACTOR = 'protractor'

const Icons = ({ className }) => {
  const [icon, setIcon] = useState(CHECK)
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (icon === CHECK) {
        setIcon(LENS)
      } else if (icon === LENS) {
        setIcon(GRAPH)
      } else if (icon === GRAPH) {
        setIcon(RULER)
      } else if (icon === RULER) {
        setIcon(PROTRACTOR)
      } else if (icon === PROTRACTOR) {
        setIcon(LENS)
      }
    }, 2000)
    return () => clearTimeout(timeout)
  }, [icon, setIcon])

  return (
    <div className={className}>
      {icon === CHECK ? (
        <CheckUploadingIcon />
      ) : icon === LENS ? (
        <LensUploadingIcon />
      ) : icon === GRAPH ? (
        <GraphUploadingIcon />
      ) : icon === RULER ? (
        <RulerUploadingIcon />
      ) : (
        <ProtractorUploadingIcon />
      )}
    </div>
  )
}

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
