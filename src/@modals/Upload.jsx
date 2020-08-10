import React, { useCallback, useState, useEffect } from 'react'
import {
  ProgressText,
  Spinner,
  UploadFrame,
  Uploader,
  useFlashNotification,
  UploadForm,
} from '@components'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

const useStyles = createUseStyles(theme => {
  return {
    Upload: {},
    Upload_Row: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '2.5rem',
    },
    Upload_Column: {},
    Upload_Column__frame: {
      marginRight: '2rem',
    },
    Upload_Column__form: {
      minWidth: '21rem',
    },
    Upload_Field: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '.5rem',
    },
    Upload_FullWidthInput: {
      display: 'block',
      flexGrow: 1,
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
    },
    Upload_Label: {
      marginBottom: '.5rem',
    },
    Upload_ButtonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '2rem',
    },
    Upload_Button: {
      padding: '.5rem 2.25rem',
    },
    Upload_Button__CancelButton: {
      marginRight: '.5rem',
    },
    Upload_Header: {
      ...theme.mixins.text.subheaderText,
      marginBottom: '1.5rem',
    },
    Upload_Error: {
      ...theme.mixins.text.formErrorText,
      margin: '.5rem 0',
    },
    Upload_DropdownIndicator: {
      width: 0,
      height: 0,
      marginRight: '1rem',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',

      /* We unfortunately need to hardcode this value because of how react-select works */
      borderTop: '8px solid #f5f5f5',
    },
    Upload_Spinner: {
      marginTop: '14rem',
      '& .path': {
        stroke: theme.variables.colors.uploaderText,
      },
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

  const { uploadModel, dispatch } = useStoreon('uploadModel')

  useEffect(() => {
    if (uploadModel.isLoaded && !uploadModel.isError) {
      navigateWithFlash('/home', 'Model added successfully.')
      dispatch('reset-upload-model')
    }
  }, [dispatch, navigateWithFlash, uploadModel])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch('reset-upload-model'), [])

  const onSubmit = useCallback(
    async data => {
      console.log('data', data)
      const { weight, material, height, name, description, category } = data

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
      }

      dispatch('upload-model', {
        file,
        data: {
          ...requiredVariables,
          ...optionalVariables,
        },
      })
    },
    [dispatch, file]
  )

  return (
    <div>
      <div className={c.Upload_Row}>
        <div className={c.Upload_Column__frame}>
          {uploadModel.isLoading ? (
            <UploadFrame>
              <Spinner className={c.Upload_Spinner} />
              <ProgressText className={c.Upload_Dots} text='Uploading' />
            </UploadFrame>
          ) : (
            <Uploader showError={uploadModel.isError} file={file} setFile={setFile} />
          )}
        </div>
        <div className={c.Upload_Column__form}>
          <UploadForm onSubmit={onSubmit} disableSubmit={!file} />
        </div>
      </div>
    </div>
  )
}

export default Upload
