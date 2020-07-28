import React, { useState, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Select from 'react-select'
import { useForm, ErrorMessage } from 'react-hook-form'
import { NewThemeLayout } from '@components/Layout'
import { Uploader, UPLOAD_MODES } from '@components/Uploader'
import { Button } from '@components/Button'
import { useFlashNotification } from '@components/Flash'
import * as GraphqlService from '@services/graphql-service'
import { Spinner } from '@components/Spinner'
import { UploadFrame } from '@components/UploadFrame'
import { ProgressText } from '@components/ProgressText'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ModelTitle } from '@components/ModelTitle'
import { Message404 } from '../404'
import { useStoreon } from 'storeon/react'

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

const graphqlService = GraphqlService.getInstance()

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
  return <span className={c.UploadVersion_Error}>{message}</span>
}

const Page = () => {
  const { id: parentModelId } = useParams()
  const history = useHistory()
  const [file, setFile] = useState()
  const [category, setCategory] = useState()
  const { navigateWithFlash } = useFlashNotification()
  const c = useStyles()

  const { loading: modelLoading, error: modelError, model } = graphqlService.useModelById(
    parentModelId
  )

  const { uploadModel, dispatch } = useStoreon('uploadModel')

  const { register, handleSubmit, errors } = useForm()

  useEffect(() => {
    if (uploadModel.isLoaded && !uploadModel.isError) {
      navigateWithFlash('/home', 'Model added successfully.')
      dispatch('reset-upload-model')
    }
  }, [dispatch, navigateWithFlash, uploadModel])

  const onSubmit = async data => {
    const requiredVariables = {
      name: sanitizeFileName(data.name),
      size: file.size,
      description: data.description,
      previousVersionModelId: parentModelId,
    }

    const optionalVariables = {
      weight: data.weight,
      height: data.height,
      material: data.material,
      category,
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

  if (modelLoading) {
    return <Spinner />
  } else if (!model) {
    return <Message404 />
  } else if (modelError) {
    return <div>Error loading Model</div>
  }

  return (
    <div>
      <h1 className={c.UploadVersion_Header}>Upload Model</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            <div className={c.UploadVersion_Field}>
              <ErrorMessage
                errors={errors}
                name='name'
                message='Please enter a name for your model'
              >
                {ShowError}
              </ErrorMessage>
              <label className={c.UploadVersion_Label} htmlFor='name'>
                Title *
              </label>
              <input
                className={c.UploadVersion_FullWidthInput}
                name='name'
                defaultValue={file && file.name}
                placeholder='Model Name'
                ref={register({ required: true })}
              />
            </div>
            <div className={c.UploadVersion_Field}>
              <label className={c.UploadVersion_Label} htmlFor='material'>
                Material
              </label>
              <input
                className={c.UploadVersion_FullWidthInput}
                name='material'
                placeholder='Material'
                ref={register}
              />
            </div>
            <div className={c.UploadVersion_Field}>
              <label className={c.UploadVersion_Label} htmlFor='weight'>
                Weight
              </label>
              <input
                className={c.UploadVersion_FullWidthInput}
                name='weight'
                placeholder='Weight'
                ref={register}
              />
            </div>
            <div className={c.UploadVersion_Field}>
              <label className={c.UploadVersion_Label} htmlFor='height'>
                Height
              </label>
              <input
                className={c.UploadVersion_FullWidthInput}
                name='height'
                placeholder='Height'
                ref={register}
              />
            </div>
            <div className={c.UploadVersion_Field}>
              <ErrorMessage
                errors={errors}
                name='description'
                message='Please enter a description for your model'
              >
                {ShowError}
              </ErrorMessage>
              <label className={c.UploadVersion_Label} htmlFor='description'>
                Description *
              </label>
              <input
                className={c.UploadVersion_FullWidthInput}
                name='description'
                placeholder='Description'
                ref={register({ required: true })}
              />
            </div>
            <div className={c.UploadVersion_Field}>
              <label className={c.UploadVersion_Label} htmlFor='category'>
                Category
              </label>
              <Select
                name='category'
                placeholder='Select Category'
                isClearable
                options={CATEGORIES}
                onChange={({ value }) => setCategory(value)}
                components={{
                  IndicatorSeparator: () => null,
                  // eslint-disable-next-line react/display-name
                  DropdownIndicator: () => {
                    // cx causes React to throw an error, so we remove it
                    return <div className={c.UploadVersion_DropdownIndicator} />
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
        <div className={c.UploadVersion_ButtonGroup}>
          <Button
            dark
            className={classnames(
              c.UploadVersion_Button,
              c.UploadVersion_Button__CancelButton
            )}
            onClick={handleCancel}
            type='button'
          >
            Cancel
          </Button>
          <Button className={c.UploadVersion_Button} type='submit' disabled={!file}>
            Save Model
          </Button>
        </div>
      </form>
    </div>
  )
}

export const UploadVersion = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}
