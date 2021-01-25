import React, { useEffect, useMemo, useState } from 'react'
import * as R from 'ramda'
import { HowTo, Spinner } from '@components'
import { useModels, usePerformanceMetrics } from '@hooks'
import Toolbar from './Toolbar'
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { perfTrack } from '@utilities/analytics'
import { flattenTree } from '@utilities/tree'

const useStyles = createUseStyles(theme => {
  return {
    HoopsModelViewer: {},
    HoopsModelViewer_WebViewContainer: {
      position: 'relative',
      width: '100%',
      flexGrow: 1,
      cursor: 'grab',
      borderTopLeftRadius: '1rem',
      borderTopRightRadius: '1rem',

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
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,

      '& svg': {
        margin: 0,
      },
    },
    HoopsModelViewer_PlaceholderText: {
      ...theme.text.viewerLoadingText,
      marginTop: '1.5rem',
      textAlign: 'center',
    },
  }
})

const findPrimaryPart = parts => {
  if (parts.length > 1) {
    return R.find(R.propEq('isPrimary', true))(parts) || parts[0]
  } else {
    return parts[0]
  }
}

const HoopsModelViewer = ({ className, model = {}, minimizeTools }) => {
  const [selectedModel, setSelectedModel] = useState(null)
  const [partList, setPartList] = useState([])
  const [partTreeData, setPartTreeData] = useState([])
  const c = useStyles()
  const { useHoopsViewer } = useModels()
  const { startTimer, getTime } = usePerformanceMetrics()

  useEffect(() => {
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const { parts } = model
    let primaryPart
    if (parts) {
      primaryPart = findPrimaryPart(parts)
    } else {
      primaryPart = model
    }

    const setPartIdAndSubs = part => {
      part.id = Math.random().toString().slice(2)
      part.subs = part.parts

      if (part.subs) {
        part.subs.forEach(subnode => {
          setPartIdAndSubs(subnode)
        })
      }
    }

    model.parts.forEach(part => {
      setPartIdAndSubs(part)
    })
    model.parts.sort((a, b) => {
      return a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1
    })
    setSelectedModel(primaryPart)
    setPartTreeData(model.parts)
    setPartList(flattenTree(model.parts))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.id])

  const viewerModel = useMemo(() => {
    if (selectedModel) {
      return encodeURIComponent(selectedModel.filename)
    } else {
      const { parts } = model
      if (parts && parts.length) {
        const primaryPart = findPrimaryPart(parts)
        return encodeURIComponent(primaryPart.filename)
      }
      return encodeURIComponent(model.filename)
    }
  }, [model, selectedModel])

  const { containerRef, hoops } = useHoopsViewer({
    modelFilename: viewerModel,
  })

  useEffect(() => {
    if (hoops.status.isReady) perfTrack('Page Loaded - HOOPS Viewer', getTime())
  }, [getTime, hoops.status.isReady])

  return (
    <div className={className}>
      <div className={c.HoopsModelViewer_WebViewContainer}>
        <div ref={containerRef} />
        {!hoops.status.statusOverlayHidden && <StatusIndicator status={hoops.status} />}
      </div>
      {hoops.status.isReady && (
        <Toolbar
          hoops={hoops}
          minimizeTools={minimizeTools}
          model={model}
          setSelectedModel={setSelectedModel}
          selectedModel={selectedModel}
          partList={partList}
          partTreeData={partTreeData}
        />
      )}
    </div>
  )
}

const StatusIndicator = ({ status }) => {
  const c = useStyles()

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
