import React, { useEffect, useState } from 'react'
import { HowTo, Spinner } from '@components'
import { useModels, usePerformanceMetrics } from '@hooks'
import Toolbar from './Toolbar'
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { perfTrack } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    HoopsModelViewer: {},
    HoopsModelViewer_WebViewContainer: {
      position: 'relative',
      width: '100%',
      flexGrow: 1,
      cursor: 'grab',
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '1rem',
      backgroundColor: 'transparent',
      '& > div': {
        pointerEvents: 'all',
      },
      [md]: {
        backgroundColor: '#ffffff',
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

const HoopsModelViewer = ({ className, model = {}, minimizeTools }) => {
  const c = useStyles()
  const { useHoopsViewer } = useModels()
  const { containerRef, hoops } = useHoopsViewer(model.uploadedFile)
  const { startTimer, getTime } = usePerformanceMetrics()

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
        <Toolbar hoops={hoops} minimizeTools={minimizeTools} model={model} />
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
