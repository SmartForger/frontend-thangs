import React, { useEffect, useState } from 'react'
import * as R from 'ramda'
import {
  Button,
  Spacer,
  Textarea,
} from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    UploadFiles_UploadZone: {
      alignItems: 'center',
      border: `1px dashed ${theme.colors.white[900]}`,
      borderRadius: '.75rem',
      display: 'flex',
      flexDirection: 'column',
      height: ({ hasFile }) => (hasFile ? '11rem' : '22.25rem'),
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
    UploadFiles_FileTitle: {
      alignItems: 'center',
      display: 'flex',
    },
    UploadFiles_FileRow: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    UploadFiles_Row: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',

      '& svg': {
        flex: 'none',
      },
    },
    UploadFiles_MissingFileIcon: {
      '& circle': {
        stroke: '#DA7069',
      },
      '& path': {
        fill: '#DA7069',
      },
      '& rect': {
        fill: '#DA7069',
      },
    },
    UploadFiles_SkippedFileIcon: {
      '& path:first-child': {
        stroke: '#999',
      },
      '& path:last-child': {
        fill: '#999',
      },
    },
    UploadFiles_FileName: {
      lineHeight: '1rem !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '16rem',
      '&.missing': {
        color: '#DA7069',
      },
      '&.skipped': {
        color: '#999',
        textDecoration: 'line-through',
      },
    },
    UploadFiles_SkipButton: {
      padding: '0 1rem !important',
    },
    UploadFiles_UploadColumn: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'center',
    },
    UploadFiles_ScrollableFiles: {
      ...theme.mixins.scrollbar,
      display: 'flex',
      flexDirection: 'column',
      height: '10.25rem',
      overflowX: 'hidden',
      overflowY: 'scroll',
      paddingTop: '.125rem',
    },
    UploadFiles_RemoveBtn: {
      cursor: 'pointer',
      zIndex: '1',
    },
    UploadFiles_ButtonWrapper: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',

      '& button': {
        width: '100%',
      },
    },
    UploadFiles_ButtonSpacer: {
      flex: 'none',
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
    UploadFiles_WarningText: {
      backgroundColor: '#FEFAEC',
      borderRadius: '.5rem',
      color: '#C29C45',
      fontWeight: '500',
      marginTop: '1.5rem',
      padding: '.625rem 1rem',
    },
    UploadAssemblyLabel: {
      display: 'flex',
      alignItems: 'center',
    },
    UploadAssemblyLabel_Icon: {
      marginLeft: '.5rem',
    },
    UploadTreeView: {
      flex: 1,
      maxHeight: '14rem',
      overflowY: 'auto',

      '& .loading': {
        width: 'calc(100% - 2rem)',

        '& > *': {
          marginLeft: '2rem',
        },
      },
    },
    UploadFiles_BrowseText: {
      color: theme.colors.grey[300],
    },
    UploadFiles_AssemblyText: {
      paddingTop: '1rem',
    },
  }
})
const noop = () => null
const Attachment = ({
  attachment,
  rawFiles,
  onCancel = noop,
  onContinue = noop,
  setErrorMessage = noop,
  setWarningMessage = noop,
  errorMessage = null,
  warningMessage = null,
}) => {
  const c = useStyles({ hasFile: true })

  const [caption, setCaption] = useState('')

  useEffect(() => {
    overlayview('AttachmentUpload - Attachment')
  }, [])

  return (
    <>
      <img src={URL.createObjectURL(rawFiles[0].file)} />
      <Spacer size={'1rem'} />
      <Textarea
        value={caption}
        onChange={setCaption}
        label="Caption"
      />
      <Spacer size={'1.5rem'} />
      <div className={c.UploadFiles_ButtonWrapper}>
        <Button secondary onClick={onCancel}>
          Cancel
        </Button>
        <Spacer size={'1rem'} className={c.UploadFiles_ButtonSpacer} />
        <Button onClick={onContinue}>
          Continue
        </Button>
      </div>
    </>
  )
}

export default Attachment
