import React, { useEffect, useRef } from 'react'
import {
  MultiLineBodyText,
  Pill,
  Spacer,
  TitleTertiary,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as UploadCardIcon } from '@svg/upload-card.svg'
import Dropzone from 'react-dropzone'
import { PHOTO_FILE_EXTS } from '@constants/fileUpload'
import { overlayview } from '@utilities/analytics'
import { isIOS } from '@utilities'

const useStyles = createUseStyles(theme => {
  return {
    UploadFiles_UploadZone: {
      alignItems: 'center',
      border: `1px dashed ${theme.colors.white[900]}`,
      borderRadius: '.75rem',
      display: 'flex',
      flexDirection: 'column',
      height: '22.25rem',
      width: '100%',

      '& h3': {
        lineHeight: '1.5rem',
      },

      '& > div': {
        height: '100%',
        outline: 'none',
        width: '100%',
      },
    },
    UploadFiles_UploadRow: {
      height: '100%',
    },
    UploadFiles_UploadColumn: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
    },
    UploadFiles_ErrorText: {
      ...theme.text.formErrorText,
      backgroundColor: theme.variables.colors.errorTextBackground,
      borderRadius: '.5rem',
      fontWeight: '500',
      marginTop: '1.5rem',
      padding: '.625rem 1rem',
      wordBreak: 'break-word',
    },
  }
})
const noop = () => null
const UploadFiles = ({
  onDrop = noop,
  errorMessage = null,
}) => {
  const c = useStyles()
  const dropzoneRef = useRef()

  useEffect(() => {
    overlayview('AttachmentUpload - UploadFiles')
  }, [])

  return (
    <>
      <Dropzone
        onDrop={onDrop}
        accept={isIOS() ? undefined : PHOTO_FILE_EXTS}
        ref={dropzoneRef}
        multiple={true}
        maxFiles={25}
      >
        {({ getRootProps, getInputProps }) => (
          <section className={c.UploadFiles_UploadZone}>
            <div {...getRootProps()}>
              <input {...getInputProps()} name='multi-upload' />
              <div className={c.UploadFiles_UploadRow}>
                <div className={c.UploadFiles_UploadColumn}>
                  <UploadCardIcon />
                  <Spacer size={'1rem'} />
                  <TitleTertiary>
                    Drag & Drop photos
                  </TitleTertiary>
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
      {errorMessage && <h4 className={c.UploadFiles_ErrorText}>{errorMessage}</h4>}
    </>
  )
}

export default UploadFiles
