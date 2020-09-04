import React, { useCallback, useState, useEffect } from 'react'
import {
  Layout,
  ProgressText,
  Spinner,
  UploadFrame,
  UploadForm,
  Uploader,
  useFlashNotification,
} from '@components'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    Upload: {},
    Upload_Row: {
      display: 'flex',
    },
    Upload_Column: {},
    Upload_Column__frame: {
      flexGrow: 1,
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

const Page = () => {
  const [file, setFile] = useState()
  const { navigateWithFlash } = useFlashNotification()
  const c = useStyles()

  const { uploadModelPhase1, dispatch } = useStoreon('uploadModelPhase1')

  useEffect(() => {
    if (uploadModelPhase1.isLoaded && !uploadModelPhase1.isError) {
      navigateWithFlash('/home', 'Model added successfully.')
      dispatch(types.RESET_UPLOAD_MODEL)
    }
  }, [dispatch, navigateWithFlash, uploadModelPhase1])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch(types.RESET_UPLOAD_MODEL), [])

  const onSubmit = useCallback(
    async data => {
      const { weight, material, height, name, category, description } = data

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

      dispatch(types.UPLOAD_MODEL_PHASE1, {
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
          {uploadModelPhase1.isLoading ? (
            <UploadFrame>
              <Spinner className={c.Upload_Spinner} />
              <ProgressText className={c.Upload_Dots} text='Uploading' />
            </UploadFrame>
          ) : (
            <Uploader showError={uploadModelPhase1.isError} file={file} setFile={setFile} />
          )}
        </div>
        <div className={c.Upload_Column__form}>
          <UploadForm onSubmit={onSubmit} disableSubmit={!file} file={file} />
        </div>
      </div>
    </div>
  )
}

const Upload = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default Upload
