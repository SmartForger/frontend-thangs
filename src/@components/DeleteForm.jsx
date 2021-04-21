import React, { useCallback, useMemo } from 'react'
import { Button, MultiLineBodyText, Spacer, NavLink } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import MobileDesktopTitle from './MobileDesktopTitle'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    DeleteForm: {
      width: '100%',
    },
    DeleteForm_Wrapper: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

      [md]: {
        width: '18.75rem',
      },

      '& button': {
        width: '100%',
      },

      '& img': {
        width: '100%',
      },
    },
    DeleteForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
      flexDirection: 'column-reverse',

      [md]: {
        flexDirection: 'unset',
      },
    },
    DeleteForm_Button: {
      maxWidth: '100%',
      width: '10.5rem',
    },
    DeleteForm_Field: {
      display: 'flex',
      flexDirection: 'column',
    },
    DeleteForm_label: {
      margin: '.5rem 0',
    },
    DeleteForm_input: {
      border: 0,
      padding: '.5rem 1rem',
      marginBottom: '.5rem',
      borderRadius: '.5rem',
      minWidth: 0,
      backgroundColor: theme.colors.white[400],
    },
    DeleteForm_textarea: {
      resize: 'vertical',
      border: 0,
      marginBottom: '2rem',
      padding: '.5rem 1rem',
      borderRadius: '.5rem',
      backgroundColor: theme.colors.white[400],
    },
    DeleteForm_ButtonRow: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
  }
})
const noop = () => null

const DeleteForm = ({
  folder = {},
  model = {},
  part = {},
  activeAttachment = {},
  type,
  handleDelete = noop,
  handleCancel = noop,
  errorMessage,
}) => {
  const c = useStyles()
  const subject = useMemo(() => {
    switch (type) {
      case 'model':
        return model
      case 'part':
        return part
      case 'folder':
        return folder
      case 'upload':
        return activeAttachment
      default:
    }
  }, [folder, model, part, type, activeAttachment])
  const { name } = subject

  const handleOnDelete = useCallback(
    e => {
      e.preventDefault()
      handleDelete(subject)
    },
    [handleDelete, subject]
  )

  return (
    <div className={c.DeleteForm_Wrapper}>
      <Spacer size='4rem' />
      {type === 'model' ? (
        <>
          <MobileDesktopTitle>Delete Model</MobileDesktopTitle>
          <Spacer size='1rem' />
          <NavLink Icon={FileIcon} label={name} />
        </>
      ) : type === 'comment' ? (
        <>
          <MobileDesktopTitle>Delete Comment</MobileDesktopTitle>
          <Spacer size='1rem' />
        </>
      ) : type === 'upload' ? (
        <>
          <MobileDesktopTitle>Delete Upload</MobileDesktopTitle>
          <Spacer size='1rem' />
        </>
      ) : (
        <>
          <MobileDesktopTitle>Delete Folder</MobileDesktopTitle>
          <Spacer size='1rem' />
          <NavLink Icon={FolderIcon} label={name} />
        </>
      )}
      <Spacer size='1rem' />
      <img
        className={c.AttachmentView_Image}
        alt={activeAttachment.caption}
        src={activeAttachment.imageUrl}
      />
      <Spacer size='1rem' />
      <MultiLineBodyText>
        Confirm below in order to delete your {type}. This action is not reversible.
      </MultiLineBodyText>
      <Spacer size='1rem' />
      <form className={c.DeleteForm} onSubmit={handleOnDelete}>
        {errorMessage && (
          <>
            <h4 className={c.EditFolder_ErrorText} data-cy='edit-folder-error'>
              {errorMessage}
            </h4>
            <Spacer size='1rem' />
          </>
        )}
        <div className={c.DeleteForm_ButtonContainer}>
          <Button
            secondary
            className={c.DeleteForm_Button}
            onClick={handleCancel}
            type='button'
          >
            Cancel
          </Button>
          <Spacer size={'1rem'} />
          <Button className={c.DeleteForm_Button} type='submit'>
            Delete
          </Button>
        </div>
      </form>
      <Spacer size='2.5rem' />
    </div>
  )
}

export default DeleteForm
