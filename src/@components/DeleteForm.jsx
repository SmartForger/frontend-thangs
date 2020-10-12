import React, { useCallback } from 'react'
import { Button, MultiLineBodyText, Spacer, TitleTertiary, NavLink } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as FileIcon } from '@svg/icon-file.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'

const useStyles = createUseStyles(theme => {
  return {
    DeleteForm: {
      width: '100%',
    },
    DeleteForm_Wrapper: {
      width: '18.75rem',

      '& button': {
        width: '100%',
      },
    },
    DeleteForm_ButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end',
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
  type,
  handleDelete = noop,
  handleCancel = noop,
  errorMessage,
}) => {
  const c = useStyles()
  const subject = type === 'model' ? model : folder
  const { id, name } = subject

  const handleOnDelete = useCallback(
    e => {
      e.preventDefault()
      debugger
      handleDelete(id)
    },
    [handleDelete, id]
  )

  return (
    <div className={c.DeleteForm_Wrapper}>
      <Spacer size='4rem' />
      {type === 'model' ? (
        <>
          <TitleTertiary>Delete Model</TitleTertiary>
          <Spacer size='1rem' />
          <NavLink Icon={FileIcon} label={name} />
        </>
      ) : (
        <>
          <TitleTertiary>Delete Folder</TitleTertiary>
          <Spacer size='1rem' />
          <NavLink Icon={FolderIcon} label={name} />
        </>
      )}
      <Spacer size='1rem' />
      <MultiLineBodyText>
        Confirm below in order to delete your folder. This action is not reversible.
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
