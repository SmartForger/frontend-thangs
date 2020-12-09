import React, { useEffect, useState, useCallback } from 'react'
import { HowTo, Spinner } from '@components'
import { useModels, usePerformanceMetrics } from '@hooks'
import Toolbar from './Toolbar'
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { perfTrack } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    HoopsModelViewer: {},
    HoopsModelViewer_WebViewContainer: {
      position: 'relative',
      width: '100%',
      flexGrow: 1,
      cursor: 'grab',
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
      ...theme.text.viewerLoadingText,
      marginTop: '1.5rem',
    },
  }
})

const HoopsModelViewer = ({ className, model, minimizeTools }) => {
  const c = useStyles()
  const [meshColor, setMeshColor] = useState()
  const [wireColor, setWireColor] = useState()
  const { useHoopsViewer } = useModels()
  const { containerRef, hoops } = useHoopsViewer(model.uploadedFile)
  const { startTimer, getTime } = usePerformanceMetrics()

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

  useEffect(() => {
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (hoops.status.isReady) perfTrack('Page Loaded - HOOPS Viewer', getTime())
  }, [getTime, hoops.status.isReady])

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
          minimizeTools={minimizeTools}
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

const ModelViewer = ({ className, model, minimizeTools }) => {
  const c = useStyles()
  const [seenHowTo, setSeenHowTo] = useState(true) //useLocalStorage('seenHowTo', false)

  return seenHowTo ? (
    <HoopsModelViewer className={className} model={model} minimizeTools={minimizeTools} />
  ) : (
    <div className={classnames(className, c.HoopsModelViewer_WebViewContainer)}>
      <HowTo setSeenHowTo={setSeenHowTo} />
    </div>
  )
}

export default ModelViewer
