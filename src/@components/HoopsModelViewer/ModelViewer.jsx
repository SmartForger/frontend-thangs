import React, { useEffect, useMemo, useState } from 'react'
import * as R from 'ramda'
import { HowTo, Spinner } from '@components'
import { useModels, usePerformanceMetrics } from '@hooks'
import Toolbar from './Toolbar'
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { perfTrack } from '@utilities/analytics'
import { flattenTree } from '@utilities'

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
  const [selectedModel, setSelectedModel] = useState(null)
  const [partList, setPartList] = useState([])
  const c = useStyles()
  const { useHoopsViewer } = useModels()
  const { startTimer, getTime } = usePerformanceMetrics()

  const viewerModel = useMemo(() => {
    if (selectedModel) {
      if (selectedModel.compositeMesh) {
        const [meshFolder, ...compositeModel] = selectedModel.compositeMesh.split('/')
        return `${compositeModel.join('%2F')}?source=${meshFolder}&`
      } else if (selectedModel.uploadedFile) {
        return encodeURIComponent(selectedModel.uploadedFile)
      } else {
        return encodeURIComponent(selectedModel.filename)
      }
    }
  }, [selectedModel])

  const { containerRef, hoops } = useHoopsViewer({
    modelURL: viewerModel,
    modelFilename: decodeURIComponent(viewerModel).split('?')[0],
  })

  useEffect(() => {
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { parts } = model
    let primaryPart
    if (parts) {
      if (parts.length > 1) {
        primaryPart = R.find(R.propEq('isPrimary', true))(parts) || parts[0]
      } else {
        primaryPart = parts[0]
      }
    } else {
      primaryPart = model
    }
    setSelectedModel(primaryPart)
    setPartList(flattenTree(model.parts, 'parts'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.id])

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
          hoops={hoops}
          minimizeTools={minimizeTools}
          model={model}
          setSelectedModel={setSelectedModel}
          selectedModel={selectedModel}
          partList={partList}
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
