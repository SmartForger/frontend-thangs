import React, { useEffect, useMemo, useState, useRef } from 'react'
import * as R from 'ramda'
import { HowTo, ModelThumbnail, Spinner } from '@components'
import useModels from '../../@hooks/useModels'
import { usePerformanceMetrics } from 'hooks'
import Toolbar from './Toolbar'
import { ReactComponent as ErrorIcon } from '@svg/image-error-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
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
      zIndex: 2,
    },
  }
})

// Passing null as partId will return the primary part
const findPart = (parts, partId = null) => {
  if (partId) {
    return R.find(R.propEq('phyndexerId', partId))(parts) || parts[0]
  } else if (parts.length > 1) {
    return R.find(R.propEq('isPrimary', true))(parts) || parts[0]
  } else {
    return parts[0]
  }
}

const sortParts = node => {
  if (node.parts) {
    node.parts.sort((a, b) => {
      const valA = a.isPrimary ? 2 : a.parts && a.parts.length > 0 ? 1 : 0
      const valB = b.isPrimary ? 2 : b.parts && b.parts.length > 0 ? 1 : 0

      return valB - valA
    })
    node.parts.forEach(a => {
      sortParts(a)
    })
  }
}

const HoopsModelViewer = ({
  className,
  model = {},
  minimizeTools,
  preselectedPart = null,
}) => {
  const [selectedModel, setSelectedModel] = useState(null)
  const [highlightedModel, setHighlightedModel] = useState(null)
  const [partList, setPartList] = useState([])
  const partListRef = useRef([])
  const c = useStyles()
  const { useHoopsViewer } = useModels()
  const { startTimer, getTime } = usePerformanceMetrics()

  useEffect(() => {
    startTimer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (model.parts) {
      sortParts(model)

      const list = flattenTree(model.parts, 'parts')

      setPartList(list)
      partListRef.current = list
      setSelectedModel(findPart(list, preselectedPart))
      if (preselectedPart) {
        setHighlightedModel(findPart(list, preselectedPart))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model.id])

  const viewerModel = useMemo(() => {
    if (selectedModel) {
      return encodeURIComponent(selectedModel.filename)
    } else {
      const parts = flattenTree(model.parts, 'parts')
      if (parts && parts.length) {
        const part = findPart(parts, preselectedPart)
        return encodeURIComponent(part.filename)
      }
      return encodeURIComponent(model.filename)
    }
  }, [model, selectedModel, preselectedPart])

  const selectModel = node => {
    setSelectedModel(node)
    setHighlightedModel(node)
  }

  const { containerRef, hoops } = useHoopsViewer({
    modelFilename: viewerModel,
    onHighlight: name => {
      const node = partListRef.current.find(node => node.originalPartName === name)
      if (node) {
        setHighlightedModel(node)
      }
    },
  })

  useEffect(() => {
    if (hoops.status.isReady) perfTrack('Page Loaded - HOOPS Viewer', getTime())
  }, [getTime, hoops.status.isReady])

  return (
    <div className={className}>
      <div className={c.HoopsModelViewer_WebViewContainer}>
        <div ref={containerRef} />
        {!hoops.status.statusOverlayHidden && (
          <StatusIndicator status={hoops.status} model={selectedModel || model} />
        )}
      </div>
      {!minimizeTools && hoops.status.isReady && (
        <Toolbar
          hoops={hoops}
          model={model}
          setSelectedModel={selectModel}
          selectedModel={selectedModel}
          highlightedModel={highlightedModel}
          partList={partList}
        />
      )}
    </div>
  )
}

const StatusIndicator = ({ status, model }) => {
  const c = useStyles()
  const modelAlt = `${model.name} by ${model.owner && model.owner.username} full viewable`
  return (
    <div className={c.HoopsModelViewer_LoadingContainer}>
      {status.isPending ? (
        <>
          {!status.isReady && (
            <ModelThumbnail
              model={model}
              name={modelAlt}
              showFallback={false}
              showLoader={false}
            />
          )}
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

const ModelViewer = ({ className, model, minimizeTools, preselectedPart }) => {
  const c = useStyles()
  const [seenHowTo, setSeenHowTo] = useState(true) //useLocalStorage('seenHowTo', false)

  return seenHowTo ? (
    <HoopsModelViewer
      className={className}
      model={model}
      minimizeTools={minimizeTools}
      preselectedPart={preselectedPart}
    />
  ) : (
    <div className={classnames(className, c.HoopsModelViewer_WebViewContainer)}>
      <HowTo setSeenHowTo={setSeenHowTo} />
    </div>
  )
}

export default ModelViewer
