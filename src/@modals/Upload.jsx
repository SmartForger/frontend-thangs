import React, { useCallback, useState, useEffect } from 'react'
import {
  Loader,
  UploadProgress,
  Uploader,
  useFlashNotification,
  UploadForm,
} from '@components'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

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
      ...theme.mixins.text.infoMessageText,
      width: '8.75rem',
      marginBottom: '14rem',
    },
  }
})

const sanitizeFileName = name => name.replace(/ /g, '_')

const Upload = () => {
  const [file, setFile] = useState()
  const { navigateWithFlash } = useFlashNotification()
  const c = useStyles()

  const { uploadModel, folders, dispatch } = useStoreon('uploadModel', 'folders')

  useEffect(() => {
    dispatch('fetch-folders')
  }, [dispatch])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch('reset-upload-model'), [])

  const onSubmit = useCallback(
    data => {
      const { weight, material, height, name, description, category, folder } = data

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
        folderId: folder ? folder : undefined,
      }

      dispatch('upload-model', {
        file,
        data: {
          ...requiredVariables,
          ...optionalVariables,
        },
        onFinish: () => {
          dispatch('close-modal')
          navigateWithFlash('/home', 'Model added successfully.')
          dispatch('reset-upload-model')
        },
      })
    },
    [dispatch, file, navigateWithFlash]
  )

  return (
    <div className={c.Upload}>
      <div className={c.Upload_Column__frame}>
        {uploadModel.isLoading ? (
          <UploadProgress />
        ) : (
          <Uploader showError={uploadModel.isError} file={file} setFile={setFile} />
        )}
      </div>
      {folders.loading ? (
        <div className={c.Upload_Column__form}>
          <Loader />
        </div>
      ) : (
        <div className={c.Upload_Column__form}>
          <UploadForm onSubmit={onSubmit} disableSubmit={!file} folders={folders.data} />
        </div>
      )}
    </div>
  )
}

export default Upload
