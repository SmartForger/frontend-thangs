import React, { useCallback, useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
import { useForm, ErrorMessage } from 'react-hook-form'
import { NewThemeLayout } from '@components/Layout'
import { Message404 } from '../404'
import { Uploader } from '@components/Uploader'
import { Button } from '@components/Button'
import { useFlashNotification } from '../../@components/Flash'
import Breadcrumbs from '../../@components/Breadcrumbs'
import { Spinner } from '@components/Spinner'
import { UploadFrame } from '@components/UploadFrame'
import { ProgressText } from '@components/ProgressText'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

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

const CATEGORIES = [
  { value: 'automotive', label: 'Automotive' },
  { value: 'aerospace', label: 'Aerospace' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'home', label: 'Home' },
  { value: 'safety', label: 'Safety' },
  { value: 'characters', label: 'Characters' },
  { value: 'architecture', label: 'Architecture' },
  { value: 'technology', label: 'Technology' },
  { value: 'hobbyist', label: 'Hobbyist' },
]

function ShowError({ message }) {
  const c = useStyles()
  return <span clasName={c.FolderUpload_Error}>{message}</span>
}

function Upload({ folder }) {
  const c = useStyles()
  const history = useHistory()
  const [file, setFile] = useState()
  const [category, setCategory] = useState()
  const { navigateWithFlash } = useFlashNotification()
  const { uploadModel, dispatch } = useStoreon('uploadModel')

  const { register, handleSubmit, errors } = useForm()

  useEffect(() => {
    if (uploadModel.isLoaded && !uploadModel.isError) {
      navigateWithFlash(`/folder/${folder.id}`, 'Model added successfully.')
      dispatch('reset-upload-model')
    }
  }, [dispatch, navigateWithFlash, uploadModel, folder])

  useEffect(() => () => dispatch('reset-upload-model'), [dispatch])

  const onSubmit = async data => {
    const { weight, material, height, name, description } = data

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

    dispatch('upload-model', {
      file,
      data: {
        ...requiredVariables,
        ...optionalVariables,
      },
    })
  }

  const handleCancel = e => {
    e.preventDefault()
    history.goBack()
  }

  const handleSelectChange = useCallback(
    e => {
      if (e && e.value) {
        setCategory(e.value)
      }
    },
    [setCategory]
  )
  const modelsCount = folder.models ? folder.models.length : 0

  return (
    <div>
      <Breadcrumbs
        className={c.FolderUpload_Breadcrumbs}
        modelsCount={modelsCount}
        folder={folder}
      ></Breadcrumbs>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <div
            className={classnames(c.FolderUpload_Column, c.FolderUpload_Column__isLast)}
          >
            <div className={c.FolderUpload_Field}>
              <ErrorMessage
                errors={errors}
                name='name'
                message='Please enter a name for your model'
              >
                {ShowError}
              </ErrorMessage>
              <label className={c.FolderUpload_Label} htmlFor='name'>
                Title *
              </label>
              <input
                className={c.FolderUpload_FullWidthInput}
                name='name'
                defaultValue={file && file.name}
                placeholder='Model Name'
                ref={register({ required: true })}
              />
            </div>
            <div className={c.FolderUpload_Field}>
              <label className={c.FolderUpload_Label} htmlFor='material'>
                Material
              </label>
              <input
                className={c.FolderUpload_FullWidthInput}
                name='material'
                placeholder='Material'
                ref={register}
              />
            </div>
            <div className={c.FolderUpload_Field}>
              <label className={c.FolderUpload_Label} htmlFor='weight'>
                Weight
              </label>
              <input
                className={c.FolderUpload_FullWidthInput}
                name='weight'
                placeholder='Weight'
                ref={register}
              />
            </div>
            <div className={c.FolderUpload_Field}>
              <label className={c.FolderUpload_Label} htmlFor='height'>
                Height
              </label>
              <input
                className={c.FolderUpload_FullWidthInput}
                name='height'
                placeholder='Height'
                ref={register}
              />
            </div>
            <div className={c.FolderUpload_Field}>
              <ErrorMessage
                errors={errors}
                name='description'
                message='Please enter a description for your model'
              >
                {ShowError}
              </ErrorMessage>
              <label className={c.FolderUpload_Label} htmlFor='description'>
                Description *
              </label>
              <input
                className={c.FolderUpload_FullWidthInput}
                name='description'
                placeholder='Description'
                ref={register({ required: true })}
              />
            </div>
            <div className={c.FolderUpload_Field}>
              <label className={c.FolderUpload_Label} htmlFor='category'>
                Category
              </label>
              <Select
                name='category'
                placeholder='Select Category'
                isClearable
                options={CATEGORIES}
                onChange={handleSelectChange}
                components={{
                  IndicatorSeparator: () => null,
                  // eslint-disable-next-line react/display-name
                  DropdownIndicator: () => {
                    // cx causes React to throw an error, so we remove it
                    return <div className={c.FolderUpload_DropdownIndicator} />
                  },
                }}
                styles={{
                  control: base => {
                    return {
                      ...base,
                      minHeight: 'auto',
                      borderRadius: '8px',
                      backgroundColor: '#616168',
                      border: 'none',
                    }
                  },
                  singleValue: base => {
                    return {
                      ...base,
                      margin: 0,
                      color: '#f5f5f5',
                    }
                  },
                  placeholder: base => {
                    return {
                      ...base,
                      margin: 0,
                      color: '#f5f5f5',
                    }
                  },
                  clearIndicator: base => {
                    return {
                      ...base,
                      color: '#f5f5f5',
                      padding: '7px',
                    }
                  },
                  input: base => {
                    return {
                      ...base,
                      margin: 0,
                      padding: 0,
                    }
                  },
                  valueContainer: base => {
                    return {
                      ...base,
                      padding: '8px 16px',
                    }
                  },
                }}
              />
            </div>
          </div>
        </div>
        <div className={c.FolderUpload_ButtonGroup}>
          <Button
            dark
            className={classnames(c.FolderUpload_Button, c.FolderUpload_CancelButton)}
            onClick={handleCancel}
            type='button'
            disabled={uploadModel.isLoading}
          >
            Cancel
          </Button>
          <Button
            className={c.FolderUpload_Button}
            type='submit'
            disabled={!file || uploadModel.isLoading || uploadModel.isError}
          >
            Save Model
          </Button>
        </div>
      </form>
    </div>
  )
}
const Page = () => {
  const { folderId } = useParams()
  const {
    dispatch,
    folders: { isLoading: loading, loadError: error, currentFolder },
  } = useStoreon('folders')

  useEffect(() => {
    dispatch('fetch-folder', folderId)
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
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}

export { FolderUpload }
