import React, { useState, useCallback } from 'react'

import { Spinner } from '@components/Spinner'
import { HowTo } from '@components/HowTo'
import { useLocalStorage } from '@customHooks/Storage'
import Toolbar from './Toolbar'
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg'

import { useHoopsViewer } from '@customHooks'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    HoopsModelViewer: {},
    HoopsModelViewer_WebViewContainer: {
      position: 'relative',
      width: '100%',
      flexGrow: 1,
      backgroundColor: '#ffffff',
      '& > div': {
        pointerEvents: 'all',
      },
    },
    HoopsModelViewer_LoadingContainer: {
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
    HoopsModelViewer_PlaceholderText: {
      ...theme.mixins.text.viewerLoadingText,
      marginTop: '1.5rem',
    },
  }
})

const HoopsModelViewer = ({ className, model }) => {
  const c = useStyles()
  const [meshColor, setMeshColor] = useState()
  const [wireColor, setWireColor] = useState()

  const { containerRef, hoops } = useHoopsViewer(model.uploadedFile)

  const handleResetView = useCallback(() => {
    const [newWireColor, newMeshColor] = hoops.resetImage()
    setWireColor(newWireColor)
    setMeshColor(newMeshColor)
  }, [hoops])

  const handleDrawModeChange = useCallback(
    modeName => {
      hoops.changeDrawMode(modeName)
    },
    [hoops]
  )

  const handleColorChange = useCallback(
    (modeName, colorStr) => {
      hoops.changeColor(modeName, colorStr)
      if (modeName === 'wire') {
        setWireColor(colorStr)
      } else if (modeName === 'mesh') {
        setMeshColor(colorStr)
      }
    },
    [hoops]
  )

  return (
    <div className={className}>
      <div className={c.HoopsModelViewer_WebViewContainer}>
        <StatusIndicator status={hoops.status} />
        <div ref={containerRef} />
      </div>
      {hoops.status.isReady && (
        <Toolbar
          onResetView={handleResetView}
          onDrawModeChange={handleDrawModeChange}
          onColorChange={handleColorChange}
          meshColor={meshColor}
          wireColor={wireColor}
        />
      )}
    </div>
  )
}

const StatusIndicator = ({ status }) => {
  const c = useStyles()
  if (status.isReady) {
    return null
  }
  return (
    <div className={c.HoopsModelViewer_LoadingContainer}>
      {status.isPending ? (
        <>
          <Spinner />
          <div className={c.HoopsModelViewer_PlaceholderText}>Loading preview...</div>
        </>
      ) : (
        status.isError && (
          <>
            <ErrorIcon />
            <div className={c.HoopsModelViewer_PlaceholderText}>
              Error Loading Preview
            </div>
          </>
        )
      )}
    </div>
  )
}

const ModelViewer = ({ className, model }) => {
  const c = useStyles()
  const [seenHowTo, setSeenHowTo] = useLocalStorage('seenHowTo', false)

  return seenHowTo ? (
    <HoopsModelViewer className={className} model={model} />
  ) : (
    <div className={classnames(className, c.HoopsModelViewer_WebViewContainer)}>
      <HowTo setSeenHowTo={setSeenHowTo} />
    </div>
  )
}

export default ModelViewer
