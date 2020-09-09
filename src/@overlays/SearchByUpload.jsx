import React, { useCallback, useEffect, useMemo, useState } from 'react'
import * as R from 'ramda'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Uploader, UploadProgress, ModelThumbnail } from '@components'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import Scanner from '@components/Scanner'
import ScannerPaper from '@components/ScannerPaper'

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

const SearchByUpload = () => {
  const c = useStyles()
  const history = useHistory()
  const { dispatch, searchResults, overlay } = useStoreon('searchResults', 'overlay')
  const { phyndexer } = searchResults
  const [newModelId, setNewModelId] = useState(R.path(['data', 'newModelId'], phyndexer))
  const model = useMemo(
    () => overlay && overlay.overlayData && overlay.overlayData.model,
    [overlay]
  )

  useEffect(() => {
    dispatch(types.RESET_SEARCH_RESULTS)
    if (model) {
      const modelId = model.id || model.modelId
      setNewModelId(modelId)
      if (modelId) {
        dispatch(types.GET_RELATED_MODELS, {
          modelId,
          onFinish: () => {
            dispatch('close-overlay')
            history.push(
              `/search/${model.uploadedFile ||
                model.modelFileName ||
                ''}?modelId=${modelId}&related=true`
            )
          },
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFile = useCallback(
    file => {
      const requiredVariables = {
        name: sanitizeFileName(file.name),
        size: file.size,
      }

      dispatch(types.GET_MODEL_SEARCH_RESULTS, {
        file,
        data: {
          ...requiredVariables,
        },
        onNewModelId: ({ newModelId }) => setNewModelId(newModelId),
        onFinish: ({ modelId, phyndexerId }) => {
          dispatch('close-overlay')
          history.push(
            `/search/${file ? file.name : ''}?modelId=${modelId}&phynId=${phyndexerId}`
          )
        },
      })
    },
    [dispatch, history]
  )

  return (
    <div>
      <div className={c.SearchByUpload}>
        {phyndexer.isLoading || model ? (
          R.isNil(newModelId) ? (
            <UploadProgress />
          ) : (
            <ScannerThumbnail model={model} />
          )
        ) : (
          <form>
            <Uploader showError={!!phyndexer.isError} setFile={handleFile} />
          </form>
        )}
      </div>
    </div>
  )
}

export default SearchByUpload
