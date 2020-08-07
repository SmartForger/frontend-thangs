import React, { useCallback, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { useForm, ErrorMessage } from 'react-hook-form'
import {
  Button,
  NewThemeLayout,
  ProgressText,
  Spinner,
  UploadFrame,
  Uploader,
  useFlashNotification,
} from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'

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

const ShowError = ({ message }) => {
  const c = useStyles()
  return <span className={c.Upload_Error}>{message}</span>
}

const Page = () => {
  const history = useHistory()
  const [file, setFile] = useState()
  const [category, setCategory] = useState()
  const { navigateWithFlash } = useFlashNotification()
  const c = useStyles()

  const { uploadModel, dispatch } = useStoreon('uploadModel')

  const { register, handleSubmit, errors } = useForm()

  useEffect(() => {
    if (uploadModel.isLoaded && !uploadModel.isError) {
      navigateWithFlash('/home', 'Model added successfully.')
      dispatch('reset-upload-model')
    }
  }, [dispatch, navigateWithFlash, uploadModel])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => () => dispatch('reset-upload-model'), [])

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
    }

    dispatch('upload-model', {
      file,
      data: {
        ...requiredVariables,
        ...optionalVariables,
      },
    })
  }

  const handleCancel = useCallback(
    e => {
      e.preventDefault()
      history.goBack()
    },
    [history]
  )

  const handleSelectChange = useCallback(
    e => {
      if (e && e.value) {
        setCategory(e.value)
      }
    },
    [setCategory]
  )

  return (
    <div>
      <h1 className={c.Upload_Header}>Upload Model</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className={c.Upload_Field}>
              <ErrorMessage
                errors={errors}
                name='name'
                message='Please enter a name for your model'
              >
                {ShowError}
              </ErrorMessage>
              <label className={c.Upload_Label} htmlFor='name'>
                Title *
              </label>
              <input
                className={c.Upload_FullWidthInput}
                name='name'
                defaultValue={file && file.name}
                placeholder='Model Name'
                ref={register({ required: true })}
              />
            </div>
            <div className={c.Upload_Field}>
              <label className={c.Upload_Label} htmlFor='material'>
                Material
              </label>
              <input
                className={c.Upload_FullWidthInput}
                name='material'
                placeholder='Material'
                ref={register}
              />
            </div>
            <div className={c.Upload_Field}>
              <label className={c.Upload_Label} htmlFor='weight'>
                Weight
              </label>
              <input
                className={c.Upload_FullWidthInput}
                name='weight'
                placeholder='Weight'
                ref={register}
              />
            </div>
            <div className={c.Upload_Field}>
              <label className={c.Upload_Label} htmlFor='height'>
                Height
              </label>
              <input
                className={c.Upload_FullWidthInput}
                name='height'
                placeholder='Height'
                ref={register}
              />
            </div>
            <div className={c.Upload_Field}>
              <ErrorMessage
                errors={errors}
                name='description'
                message='Please enter a description for your model'
              >
                {ShowError}
              </ErrorMessage>
              <label className={c.Upload_Label} htmlFor='description'>
                Description *
              </label>
              <input
                className={c.Upload_FullWidthInput}
                name='description'
                placeholder='Description'
                ref={register({ required: true })}
              />
            </div>
            <div className={c.Upload_Field}>
              <label className={c.Upload_Label} htmlFor='category'>
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
                    return <div className={c.Upload_DropdownIndicator} />
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
        <div className={c.Upload_ButtonGroup}>
          <Button
            dark
            className={classnames(c.Upload_Button, c.Upload_Button__CancelButton)}
            onClick={handleCancel}
            type='button'
          >
            Cancel
          </Button>
          <Button className={c.Upload_Button} type='submit' disabled={!file}>
            Save Model
          </Button>
        </div>
      </form>
    </div>
  )
}

export const Upload = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}
