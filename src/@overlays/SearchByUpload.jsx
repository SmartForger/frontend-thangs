import React, { useCallback, useEffect, useRef } from 'react'
import * as R from 'ramda'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { ModelThumbnail, UploaderContent, UploadProgress } from '@components'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import Scanner from '@components/Scanner'
import ScannerPaper from '@components/ScannerPaper'
import { useFileUpload } from '@hooks'
import { numberWithCommas } from '@utilities'
import { overlayview } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    SearchByUpload_Container: {
      height: '100%',

      [md]: {
        height: 'unset',
      },
    },
    SearchByUpload: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',

      [md]: {
        height: 'unset',
        marginTop: '4rem',
      },
    },
    SearchByUpload_Thumbnail: {
      paddingBottom: 0,
      minHeight: '12.25rem',
      margin: 'auto',
      maxWidth: 'calc(100% - 7.375rem)',
      width: '100%',
      borderRadius: '.5rem .5rem 0 0',
      zIndex: '1',
    },
  }
})

const ScannerThumbnail = ({ model, polygonCount }) => {
  const c = useStyles()

  if (!model || R.isEmpty(model)) {
    return (
      <Scanner>
        <ScannerPaper polygonCount={polygonCount} />
      </Scanner>
    )
  }

  return (
    <Scanner polygonCount={polygonCount}>
      <ModelThumbnail
        className={c.SearchByUpload_Thumbnail}
        name={model && model.name}
        model={model}
        useThumbnailer={true}
      />
    </Scanner>
  )
}

const sanitizeFileName = name => name.replace(/ /g, '_')
const getFileName = filename => {
  if (!filename) return null
  const filenameArray = filename.split('/')
  return filenameArray[filenameArray.length - 1]
}

const SearchByUpload = ({
  model,
  file: initialFile,
  errorState: initialErrorState,
  isExplorerOpened,
}) => {
  const containerRef = useRef(null)
  const c = useStyles()
  const history = useHistory()
  const { setOverlayOpen } = useOverlay()
  const { dispatch, searchResults } = useStoreon('searchResults')
  // const closeOverlay = useCallback(() => {
  //   setOverlayOpen(false)
  // }, [setOverlayOpen])
  // useExternalClick(containerRef, closeOverlay)
  const { phyndexer, thangs, uploadData } = searchResults
  const polygonCount =
    searchResults &&
    searchResults.polygonCount &&
    numberWithCommas(searchResults.polygonCount)
  const newFileName = R.path(['data', 'newFileName'], uploadData)

  const handleFile = useCallback(
    file => {
      if (!file) return
      const requiredVariables = {
        name: sanitizeFileName(file.name),
        size: file.size,
      }
      dispatch(types.GET_MODEL_SEARCH_RESULTS, {
        file,
        data: {
          ...requiredVariables,
        },
        onFinish: ({ modelId, phyndexerId }) => {
          setOverlayOpen(false)
          history.push(
            `/search/${file ? file.name?.replace('#', encodeURIComponent('#')) : ''}?${
              modelId ? `modelId=${modelId}&` : ''
            }phynId=${phyndexerId}`
          )
        },
      })
    },
    [dispatch, history, setOverlayOpen]
  )

  const { UploadZone, errorState, file, cancelUpload } = useFileUpload({
    isExplorerOpened,
    onSetFile: handleFile,
    file: initialFile,
    errorState: initialErrorState,
  })

  useEffect(() => {
    dispatch(types.RESET_SEARCH_RESULTS)
    overlayview('SearchByUpload')
    if (model) {
      const modelId = model.id || model.modelId
      const phynId =
        (model.parts &&
          model.parts.find(part => part.phyndexerId) &&
          model.parts.find(part => part.phyndexerId).phyndexerId) ||
        model.modelId
      const searchTerm =
        model.uploadedFile ||
        model.modelFileName ||
        getFileName(model.fileName) ||
        'model'
      if (modelId) {
        dispatch(types.GET_RELATED_MODELS, {
          modelId,
          phyndexerId: phynId,
          geoSearch: false,
          onFinish: () => {
            setOverlayOpen(false)
            history.push(
              `/search/${searchTerm}?modelId=${modelId}&phynId=${phynId}&related=true`
            )
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div ref={containerRef} className={c.SearchByUpload_Container}>
      <div className={c.SearchByUpload}>
        {phyndexer.isLoading || thangs.isLoading || model ? (
          !R.isNil(model) ? (
            <ScannerThumbnail polygonCount={polygonCount} model={model} />
          ) : newFileName ? (
            <ScannerThumbnail
              polygonCount={polygonCount}
              model={{ uploadedFile: newFileName }}
            />
          ) : (
            <UploadProgress />
          )
        ) : (
          <form>
            <UploadZone>
              <UploaderContent
                errorState={errorState}
                file={file}
                cancelUpload={cancelUpload}
                showError={phyndexer.isError || thangs.isError}
              />
            </UploadZone>
          </form>
        )}
      </div>
    </div>
  )
}

export default SearchByUpload
