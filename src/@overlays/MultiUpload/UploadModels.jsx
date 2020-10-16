import React from 'react'
import * as R from 'ramda'
import {
  Button,
  Divider,
  MetadataSecondary,
  MultiLineBodyText,
  Pill,
  SingleLineBodyText,
  Spacer,
  Spinner,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as UploadCardIcon } from '@svg/upload-card.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { formatBytes } from '@utilities'
import Dropzone from 'react-dropzone'
import { MODEL_FILE_EXTS } from '@constants/fileUpload'

const useStyles = createUseStyles(theme => {
  return {
    UploadModels_UploadZone: {
      width: '100%',
      height: ({ hasFile }) => (hasFile ? '11rem' : '22.25rem'),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '.75rem',
      border: '1px dashed #E5E5F3',

      '& h3': {
        lineHeight: '1.5rem',
      },

      '& > div': {
        height: '100%',
        outline: 'none',
      },
    },
    UploadModels_UploadRow: {
      height: '100%',
    },
    UploadModels_FileRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    UploadModels_Row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',

      '& svg': {
        flex: 'none',
      },
    },
    UploadModels_FileName: {
      textOverflow: 'ellipsis',
      width: '16rem',
      overflow: 'hidden',
      lineHeight: '1rem !important',
    },
    UploadModels_UploadColumn: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    UploadModels_ScrollableFiles: {
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden',
      overflowY: 'scroll',
      scrollbarWidth: 'thin',
      scrollbarColor: '#C7C7C7 white',
      height: '10.25rem',
      paddingTop: '.125rem',

      '&::-webkit-scrollbar': {
        width: '.75rem',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.white[600],
        borderRadius: '.5rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: `3px solid ${theme.colors.white[600]}`,
      },
    },
    UploadModels_RemoveBtn: {
      cursor: 'pointer',
      zIndex: 1,
    },
    UploadModels_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    UploadModels_ErrorText: {
      ...theme.text.formErrorText,
      marginTop: '1.5rem',
      backgroundColor: theme.variables.colors.errorTextBackground,
      fontWeight: 500,
      padding: '.625rem 1rem',
      borderRadius: '.5rem',
    },
  }
})
const noop = () => null
const UploadModels = ({
  uploadFiles,
  onDrop = noop,
  removeFile = noop,
  closeOverlay = noop,
  handleContinue = noop,
  errorMessage = null,
}) => {
  const hasFile = Object.keys(uploadFiles).length > 0
  const c = useStyles({ hasFile })

  return (
    <>
      <Dropzone onDrop={onDrop} accept={MODEL_FILE_EXTS} maxFiles={50}>
      <Dropzone onDrop={onDrop} accept={MODEL_FILE_EXTS} maxFiles={25}>
        {({ getRootProps, getInputProps }) => (
          <section className={c.UploadModels_UploadZone}>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <div className={c.UploadModels_UploadRow}>
                <div className={c.UploadModels_UploadColumn}>
                  {R.isEmpty(uploadFiles) && <UploadCardIcon />}
                  <Spacer size={'1rem'} />
                  <TitleTertiary>Drag & Drop files</TitleTertiary>
                  <MultiLineBodyText>or browse to upload.</MultiLineBodyText>
                  <Spacer size={'1rem'} />
                  <Pill secondary>Browse</Pill>
                  <Spacer size={'.75rem'} />
                </div>
              </div>
            </div>
          </section>
        )}
      </Dropzone>
      {errorMessage && (
        <>
          <h4 className={c.UploadModels_ErrorText}>{errorMessage}</h4>
          <Spacer size='1rem' />
        </>
      )}
      {!R.isEmpty(uploadFiles) && (
        <>
          <Spacer size={'1.5rem'} />
          <TitleTertiary>Files</TitleTertiary>
          <Spacer size={'.5rem'} />
          <div className={c.UploadModels_ScrollableFiles}>
            {Object.keys(uploadFiles).map((id, index) => {
              const file = uploadFiles[id]
              const isLoading = file.isLoading
              return (
                <div key={`fileUpload_${index}`}>
                  <Spacer size={'.75rem'} />
                  <div className={c.UploadModels_FileRow}>
                    <div className={c.UploadModels_Row}>
                      {isLoading ? <Spinner size={'1rem'} /> : <FileIcon />}
                      <Spacer size={'.75rem'} />
                      <SingleLineBodyText
                        className={c.UploadModels_FileName}
                        title={file.name}
                      >
                        {file.name}
                      </SingleLineBodyText>
                      <Spacer size={'.5rem'} />
                      <MetadataSecondary>{formatBytes(file.size)}</MetadataSecondary>
                    </div>
                    <div>
                      <TrashCanIcon
                        className={c.UploadModels_RemoveBtn}
                        onClick={() => removeFile(id)}
                      />
                    </div>
                  </div>
                  <Spacer size={'.75rem'} />
                  <Divider spacing={0} />
                </div>
              )
            })}
          </div>
          <Spacer size={'1.5rem'} />
          <div className={c.UploadModels_ButtonWrapper}>
            <Button secondary onClick={closeOverlay}>
              Cancel
            </Button>
            <Spacer size={'1rem'} />
            <Button onClick={handleContinue}>Continue</Button>
          </div>
        </>
      )}
      <Spacer size={'1rem'} />
    </>
  )
}

export default UploadModels
