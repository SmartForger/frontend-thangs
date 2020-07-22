import React, { useState, useEffect } from 'react'
import { ProgressText } from '@components/ProgressText'
import { UploadFrame } from '@components/UploadFrame'
import { ReactComponent as CheckUploadingIcon } from '@svg/check-uploading-icon.svg'
import { ReactComponent as LensUploadingIcon } from '@svg/lens-uploading-icon.svg'
import { ReactComponent as GraphUploadingIcon } from '@svg/graph-uploading-icon.svg'
import { ReactComponent as RulerUploadingIcon } from '@svg/ruler-uploading-icon.svg'
import { ReactComponent as ProtractorUploadingIcon } from '@svg/protractor-uploading-icon.svg'
import { infoMessageText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    IconContainer: {
      height: '10.5rem',
      width: '10.5rem',
      marginTop: '9.5rem',
      textAlign: 'center',
    },
    Dots: {
      ...infoMessageText, //TODO - Move to theme
      marginBottom: '10rem',
      width: '16rem',
    },
    UploadFrame: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
  }
})

const c = useStyles()
const CHECK = 'check'
const LENS = 'lens'
const GRAPH = 'graph'
const RULER = 'ruler'
const PROTRACTOR = 'protractor'

const Icons = () => {
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
    <div className={c.IconContainer}>
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

export const UploadProgress = () => {
  return (
    <UploadFrame className={c.UploadFrame}>
      <Icons />
      <ProgressText text='Searching matches' className={c.Dots} />
    </UploadFrame>
  )
}
