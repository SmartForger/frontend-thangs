import React, { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import {
  Breadcrumbs,
  Layout,
  ProgressText,
  Spinner,
  UploadFrame,
  UploadForm,
  Uploader,
  useFlashNotification,
} from '@components'
import { Message404 } from './404'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    FolderUpload: {},
    FolderUpload_Row: {
      display: 'flex',
    },
    FolderUpload_Column: {
      flexGrow: 1,
      marginRight: '2rem',
    },
    FolderUpload_Column__isLast: {
      minWidth: '21rem',
    },
    FolderUpload_Field: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '.25rem',
    },
    FolderUpload_FullWidthInput: {
      display: 'block',
      flexGrow: 1,
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
    },
    FolderUpload_Label: {
      marginBottom: '.5rem',
    },
    FolderUpload_ButtonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '2rem',
    },
    FolderUpload_Button: {
      padding: '.5rem 2.25rem',
    },
    FolderUpload_CancelButton: {
      marginRight: '.5rem',
    },
    FolderUpload_Error: {
      ...theme.mixins.text.formErrorText,
      margin: '.5rem 0',
    },
    FolderUpload_DropdownIndicator: {
      width: 0,
      height: 0,
      marginRight: '1rem',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',

      /* We unfortunately need to hardcode this value because of how react-select works */
      borderTop: '8px solid #f5f5f5',
    },
    FolderUpload_Spinner: {
      marginTop: '14rem',
      '& .path': {
        stroke: theme.variables.colors.uploaderText,
      },
    },
    FolderUpload_Dots: {
      ...theme.mixins.text.infoMessageText,
      width: '8.75rem',
      marginBottom: '14rem',
    },
    FolderUpload_Breadcrumbs: {
      marginBottom: '3rem',
    },
  }
})

const sanitizeFileName = name => name.replace(/ /g, '_')

function Upload({ folder }) {
  const c = useStyles()
  const [file, setFile] = useState()
  const { navigateWithFlash } = useFlashNotification()
  const { uploadModel, dispatch } = useStoreon('uploadModel')

  useEffect(() => {
    if (uploadModel.isLoaded && !uploadModel.isError) {
      navigateWithFlash(`/folder/${folder.id}`, 'Model added successfully.')
      dispatch(types.RESET_UPLOAD_MODEL)
    }
  }, [dispatch, navigateWithFlash, uploadModel, folder])

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
        folderId: folder.id,
      }

      dispatch(types.UPLOAD_MODEL, {
        file,
        data: {
          ...requiredVariables,
          ...optionalVariables,
        },
      })
    },
    [dispatch, file, folder]
  )

  const modelsCount = folder.models ? folder.models.length : 0

  return (
    <div>
      <Breadcrumbs
        className={c.FolderUpload_Breadcrumbs}
        modelsCount={modelsCount}
        folder={folder}
      ></Breadcrumbs>
      <div className={c.FolderUpload_Row}>
        <div className={c.FolderUpload_Column}>
          {uploadModel.isLoading ? (
            <UploadFrame>
              <Spinner className={c.FolderUpload_Spinner} />
              <ProgressText className={c.FolderUpload_Dots} text='Uploading' />
            </UploadFrame>
          ) : (
            <Uploader showError={uploadModel.isError} file={file} setFile={setFile} />
          )}
        </div>
        <div className={classnames(c.FolderUpload_Column, c.FolderUpload_Column__isLast)}>
          <UploadForm
            onSubmit={onSubmit}
            disableSubmit={!file || uploadModel.isLoading || uploadModel.isError}
            file={file}
          />
        </div>
      </div>
    </div>
  )
}
const Page = () => {
  const { folderId } = useParams()
  const {
    dispatch,
    folders: { isLoading: loading, isError: error, currentFolder },
  } = useStoreon('folders')

  useEffect(() => {
    dispatch(types.FETCH_FOLDER, { folderId })
  }, [dispatch, folderId])

  const folder = currentFolder

  if (loading) {
    return <Spinner />
  } else if (!folder) {
    return <Message404 />
  } else if (error) {
    return <div>Error loading folder</div>
  }
  return <Upload folder={folder} />
}

const FolderUpload = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default FolderUpload
