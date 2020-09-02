import React, { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  ModelTitle,
  Layout,
  ProgressText,
  Spinner,
  UploadFrame,
  UploadForm,
  Uploader,
  useFlashNotification,
} from '@components'
import { UPLOAD_MODES } from '@components/Uploader'
import { createUseStyles } from '@style'
import { useServices } from '@hooks'
import { Message404 } from './404'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    UploadVersion: {},
    UploadVersion_Row: {
      display: 'flex',
    },
    UploadVersion_Column: {},
    UploadVersion_Column__frame: {
      flexGrow: 1,
      marginRight: '2rem',
    },
    UploadVersion_Column__form: {
      minWidth: '21rem',
    },
    UploadVersion_Field: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '.5rem',
    },
    UploadVersion_FullWidthInput: {
      display: 'block',
      flexGrow: 1,
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
    },
    UploadVersion_Label: {
      marginBottom: '.5rem',
    },
    UploadVersion_ButtonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '2rem',
    },
    UploadVersion_Button: {
      padding: '.5rem 2.25rem',
    },
    UploadVersion_Button__CancelButton: {
      marginRight: '.5rem',
    },
    UploadVersion_Header: {
      ...theme.mixins.text.subheaderText,
      marginBottom: '1.5rem',
    },
    UploadVersion_Error: {
      ...theme.mixins.text.formErrorText,
      margin: '.5rem 0',
    },
    UploadVersion_DropdownIndicator: {
      width: 0,
      height: 0,
      marginRight: '1rem',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',

      /* We unfortunately need to hardcode this value because of how react-select works */
      borderTop: '8px solid #f5f5f5',
    },
    UploadVersion_Spinner: {
      marginTop: '14rem',
      '& .path': {
        stroke: theme.variables.colors.uploaderText,
      },
    },
    UploadVersion_Dots: {
      ...theme.mixins.text.infoMessageText,
      width: '8.75rem',
      marginBottom: '14rem',
    },
    UploadVersion_ModelTitle: {
      marginBottom: '2rem',
    },
  }
})

const sanitizeFileName = name => name.replace(/ /g, '_')

const Page = () => {
  const { id: parentModelId } = useParams()
  const [file, setFile] = useState()
  const { navigateWithFlash } = useFlashNotification()
  const c = useStyles()
  const { useFetchOnce } = useServices()
  const {
    atom: { data: model, isLoading: modelLoading, isError: modelError },
  } = useFetchOnce(parentModelId, 'model')

  const { uploadModel, dispatch } = useStoreon('uploadModel')

  useEffect(() => {
    if (uploadModel.isLoaded && !uploadModel.isError) {
      navigateWithFlash(`/model/${parentModelId}`, 'Model added successfully.')
      dispatch(types.RESET_UPLOAD_MODEL)
    }
  }, [dispatch, navigateWithFlash, parentModelId, uploadModel])

  useEffect(() => () => dispatch(types.RESET_UPLOAD_MODEL), [dispatch])

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
        ...(parentModelId.length > 0 && { previousVersionModelId: parentModelId }),
      }

      dispatch(types.UPLOAD_MODEL, {
        file,
        data: {
          ...requiredVariables,
          ...optionalVariables,
        },
      })
    },
    [dispatch, file, parentModelId]
  )

  if (modelLoading) {
    return <Spinner />
  } else if (!model) {
    return <Message404 />
  } else if (modelError) {
    return <div>Error loading Model</div>
  }

  return (
    <div>
      <h1 className={c.UploadVersion_Header}>Upload New Version</h1>
      <div className={c.UploadVersion_Row}>
        <div className={c.UploadVersion_Column__frame}>
          {uploadModel.isLoading ? (
            <UploadFrame>
              <Spinner className={c.UploadVersion_Spinner} />
              <ProgressText className={c.UploadVersion_Dots} text='Uploading' />
            </UploadFrame>
          ) : (
            <Uploader
              showError={uploadModel.isError}
              file={file}
              setFile={setFile}
              mode={UPLOAD_MODES.VERSION}
            />
          )}
        </div>
        <div className={c.UploadVersion_Column__form}>
          {model && <ModelTitle className={c.UploadVersion_ModelTitle} model={model} />}
          <UploadForm onSubmit={onSubmit} disableSubmit={!file} file={file} />
        </div>
      </div>
    </div>
  )
}

const UploadVersion = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default UploadVersion
