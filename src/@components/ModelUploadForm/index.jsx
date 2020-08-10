import React, { useState } from 'react'
import { Spinner, ProgressText, Uploader, UploadFrame, UploadForm } from '@components'
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
      ...theme.mixins.text.formErrorText,
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
        stroke: theme.variables.colors.uploaderText,
      },
    },
    ModelUploadForm_Dots: {
      ...theme.mixins.text.infoMessageText,
      width: '8.75rem',
      marginBottom: '14rem',
    },
  }
})

const ModelUploadForm = ({ onSubmit, isUploading, error }) => {
  const c = useStyles()
  const [file, setFile] = useState()

  return (
    <>
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
          <UploadForm
            onSubmit={onSubmit}
            disableSubmit={!file || isUploading || error}
            file={file}
          />
        </div>
      </div>
    </>
  )
}

export default ModelUploadForm
