import React, { useCallback, useEffect } from 'react'
import * as R from 'ramda'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { UploadProgress, ModelThumbnail, UploaderContent } from '@components'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import Scanner from '@components/Scanner'
import ScannerPaper from '@components/ScannerPaper'
import { useFileUpload } from '@hooks'

const useStyles = createUseStyles(_theme => {
  return {
    SearchByUpload: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '4rem',
    },
    SearchByUpload_Thumbnail: {
      paddingBottom: 0,
      minHeight: '12.25rem',
      margin: 'auto',
      maxWidth: 'calc(100% - 7.375rem)',
      width: '100%',
      borderRadius: '.5rem .5rem 0 0',
      zIndex: -1,
    },
  }
})

const ScannerThumbnail = ({ model }) => {
  const c = useStyles()

  if (!model || R.isEmpty(model)) {
    return (
      <Scanner>
        <ScannerPaper />
      </Scanner>
    )
  }

  return (
    <Scanner>
      <ModelThumbnail
        className={c.SearchByUpload_Thumbnail}
        name={model && model.name}
        model={model}
        showWaldo={false}
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

const SearchByUpload = () => {
  const c = useStyles()
  const history = useHistory()
  const { dispatch, searchResults, overlay } = useStoreon('searchResults', 'overlay')
  const { phyndexer, thangs, uploadData } = searchResults
  const overlayData = (overlay && overlay.overlayData) || {}
  const model = overlayData.model
  const initialFile = overlayData.file
  const isExplorerOpened = overlayData.isExplorerOpened

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
          dispatch(types.CLOSE_OVERLAY)
          history.push(
            `/search/${file ? file.name : ''}?modelId=${modelId}&phynId=${phyndexerId}`
          )
        },
      })
    },
    [dispatch, history]
  )

  const { UploadZone, errorState, file, cancelUpload } = useFileUpload({
    isExplorerOpened,
    onSetFile: handleFile,
    file: initialFile,
  })

  useEffect(() => {
    dispatch(types.RESET_SEARCH_RESULTS)
    if (model) {
      const modelId = model.id || model.modelId
      const searchTerm =
        model.uploadedFile ||
        model.modelFileName ||
        getFileName(model.fileName) ||
        'model'
      if (modelId) {
        dispatch(types.GET_RELATED_MODELS, {
          modelId,
          onFinish: () => {
            dispatch(types.CLOSE_OVERLAY)
            history.push(`/search/${searchTerm}?modelId=${modelId}&related=true`)
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className={c.SearchByUpload}>
        {phyndexer.isLoading || thangs.isLoading || model ? (
          !R.isNil(model) ? (
            <ScannerThumbnail model={model} />
          ) : newFileName ? (
            <ScannerThumbnail model={{ uploadedFile: newFileName }} />
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
