import React, { useCallback, useEffect } from 'react'
import * as R from 'ramda'
import { Loader, UploadProgress, useFlashNotification, UploadForm, UploaderContent } from '@components'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { useFileUpload } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    Upload: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '4rem',
    },
    Upload_Column__frame: {
      marginRight: '2rem',
    },
    Upload_Column__form: {
      minWidth: '21rem',
    },
    Upload_Dots: {
      ...theme.text.infoMessageText,
      width: '8.75rem',
      marginBottom: '14rem',
    },
  }
})

const sanitizeFileName = name => name.replace(/ /g, '_')

const Upload = ({ prevModelId }) => {
  const { navigateWithFlash } = useFlashNotification()
  const c = useStyles()

  const { uploadModelPhase1, folders, overlay, dispatch } = useStoreon(
    'uploadModelPhase1',
    'folders',
    'overlay'
  )

  useEffect(() => {
    dispatch(types.FETCH_FOLDERS)
  }, [dispatch])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(types.RESET_UPLOAD_MODEL), [])

  const handleFileUpload = useCallback(
    file => {
      if (R.isNil(file)) {
        dispatch(types.RESET_UPLOAD_MODEL)
      } else {
        dispatch(types.UPLOAD_MODEL_PHASE1, { file })
      }
    },
    [dispatch]
  )

  const { UploadZone, file, errorState, cancelUpload } = useFileUpload({
    onSetFile: handleFileUpload,
  })

  const handleSubmit = useCallback(
    data => {
      const {
        weight,
        material,
        height,
        name,
        description,
        category,
        folder: folderId,
      } = data

      const requiredVariables = {
        name: sanitizeFileName(name),
        size: file.size,
        description,
      }

      const optionalVariables = {
        ...(weight.length > 0 && { weight }),
        ...(height.length > 0 && { height }),
        ...(material.length > 0 && { material }),
        ...(category && { category }),
        ...(!R.isNil(prevModelId) && { previousVersionModelId: prevModelId }),
        folderId,
      }

      dispatch(types.UPLOAD_MODEL_PHASE2, {
        data: {
          ...requiredVariables,
          ...optionalVariables,
        },
        onFinish: () => {
          dispatch(types.CLOSE_OVERLAY)
          navigateWithFlash(
            folderId ? `/folder/${folderId}` : '/home',
            'Model added successfully.'
          )
          dispatch(types.RESET_UPLOAD_MODEL)
        },
      })
    },
    [dispatch, file, navigateWithFlash, prevModelId]
  )

  return (
    <div className={c.Upload}>
      <div className={c.Upload_Column__frame}>
        {uploadModelPhase1.isLoading ? (
          <UploadProgress />
        ) : (
          <UploadZone>
            <UploaderContent
              errorState={errorState}
              file={file}
              cancelUpload={cancelUpload}
              showError={uploadModelPhase1.isError}
            />
          </UploadZone>
        )}
      </div>
      {folders.loading ? (
        <div className={c.Upload_Column__form}>
          <Loader />
        </div>
      ) : (
        <div className={c.Upload_Column__form}>
          <UploadForm
            onSubmit={handleSubmit}
            disableSubmit={!file || uploadModelPhase1.isLoading}
            isLoading={uploadModelPhase1.isLoading}
            folders={folders.data}
            selectedFolderId={
              overlay && overlay.overlayData && overlay.overlayData.folderId
            }
          />
        </div>
      )}
    </div>
  )
}

export default Upload
