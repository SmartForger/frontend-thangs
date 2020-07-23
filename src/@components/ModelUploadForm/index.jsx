import React, { useState } from 'react'
import { useForm, ErrorMessage } from 'react-hook-form'

import { formErrorText, infoMessageText } from '../../@style/text'

import { Spinner } from '../Spinner'
import { Button, DarkButton } from '../Button'
import { ProgressText } from '../ProgressText'
import { Uploader } from '../Uploader'
import { UploadFrame } from '../UploadFrame'
import { CategorySelect } from './CategorySelect'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelUploadForm: {},
    ModelUploadForm_ButtonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '2rem',
    },
    ModelUploadForm_Button: {
      padding: '.5rem 2rem',
    },
    ModelUploadForm_CancelButton: {
      marginRight: '.5rem',
    },
    ModelUploadForm_Error: {
      ...formErrorText,
      margin: '.5rem 0',
    },
    ModelUploadForm_Row: {
      display: 'flex',
    },
    ModelUploadForm_ColumnLeft: {
      flexGrow: 1,
      marginRight: '2rem',
    },
    ModelUploadForm_ColumnRight: {
      minWidth: '21rem',
    },
    ModelUploadForm_Field: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '.5rem',
    },
    ModelUploadForm_FullWidthInput: {
      display: 'block',
      flexGrow: 1,
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
    },
    ModelUploadForm_Label: {
      marginBottom: '.5rem',
    },
    ModelUploadForm_Spinner: {
      marginTop: '14rem',
      '& .path': {
        stroke: theme.color.uploaderText,
      },
    },
    ModelUploadForm_Dots: {
      ...infoMessageText,
      width: '8.5rem',
      marginBottom: '14rem',
    },
  }
})

function ShowError({ message }) {
  const c = useStyles()
  return <span className={c.ModelUploadForm_Error}>{message}</span>
}

export function ModelUploadForm({ onSubmit, isUploading, error, onCancel }) {
  const c = useStyles()
  const { register, handleSubmit, errors } = useForm()
  const [file, setFile] = useState()
  const [category, setCategory] = useState()

  return (
    <form onSubmit={handleSubmit(onSubmit({ file, category }))}>
      <div className={c.ModelUploadForm_Row}>
        <div className={c.ModelUploadForm_ColumnLeft}>
          {isUploading ? (
            <UploadFrame>
              <Spinner className={c.ModelUploadForm_Spinner} />
              <ProgressText className={c.ModelUploadForm_Dots} text='Uploading' />
            </UploadFrame>
          ) : (
            <Uploader showError={!!error} file={file} setFile={setFile} />
          )}
        </div>
        <div className={c.ModelUploadForm_ColumnRight}>
          <div className={c.ModelUploadForm_Field}>
            <ErrorMessage
              errors={errors}
              name='name'
              message='Please enter a name for your model'
            >
              {ShowError}
            </ErrorMessage>
            <label className={c.ModelUploadForm_Label} htmlFor='name'>
              Title *
            </label>
            <input
              className={c.ModelUploadForm_FullWidthInput}
              name='name'
              defaultValue={file && file.name}
              placeholder='Model Name'
              ref={register({ required: true })}
            />
          </div>
          <div className={c.ModelUploadForm_Field}>
            <label className={c.ModelUploadForm_Label} htmlFor='material'>
              Material
            </label>
            <input
              className={c.ModelUploadForm_FullWidthInput}
              name='material'
              placeholder='Material'
              ref={register}
            />
          </div>
          <div className={c.ModelUploadForm_Field}>
            <label className={c.ModelUploadForm_Label} htmlFor='weight'>
              Weight
            </label>
            <input
              className={c.ModelUploadForm_FullWidthInput}
              name='weight'
              placeholder='Weight'
              ref={register}
            />
          </div>
          <div className={c.ModelUploadForm_Field}>
            <label className={c.ModelUploadForm_Label} htmlFor='height'>
              Height
            </label>
            <input
              className={c.ModelUploadForm_FullWidthInput}
              name='height'
              placeholder='Height'
              ref={register}
            />
          </div>
          <div className={c.ModelUploadForm_Field}>
            <ErrorMessage
              errors={errors}
              name='description'
              message='Please enter a description for your model'
            >
              {ShowError}
            </ErrorMessage>
            <label className={c.ModelUploadForm_Label} htmlFor='description'>
              Description *
            </label>
            <input
              className={c.ModelUploadForm_FullWidthInput}
              name='description'
              placeholder='Description'
              ref={register({ required: true })}
            />
          </div>
          <div className={c.ModelUploadForm_Field}>
            <label className={c.ModelUploadForm_Label} htmlFor='category'>
              Category
            </label>
            <CategorySelect setCategory={setCategory} />
          </div>
        </div>
      </div>
      <div className={c.ModelUploadForm_ButtonGroup}>
        <DarkButton
          className={classnames(c.ModelUploadForm_Button, c.ModelUploadForm_CancelButton)}
          onClick={onCancel}
          type='button'
          disabled={isUploading}
        >
          Cancel
        </DarkButton>
        <Button
          className={c.ModelUploadForm_Button}
          type='submit'
          disabled={!file || isUploading || error}
        >
          Save Model
        </Button>
      </div>
    </form>
  )
}
