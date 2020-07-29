import React, { useCallback, useState } from 'react'
import Modal from '../Modal'
import { UserInline } from '../UserInline'
import { CreateFolderForm, DisplayErrors } from '../FolderForm'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import { useCurrentUser } from '@customHooks/Users'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    FolderCreateModal: {},
    FolderCreateModal_Header: {
      ...theme.mixins.text.headerText,
      marginBottom: '1rem',
    },
    FolderCreateModal_Text: {
      ...theme.mixins.text.lightText,
    },
    FolderCreateModal_Row: {
      display: 'flex',
      marginTop: '4.25rem',
    },
    FolderCreateModal_Row__hasError: {
      marginTop: '1rem',
    },
    FolderCreateModal_NewFolderIcon: {
      marginBottom: '1rem',
    },
    FolderCreateModal_DisplayErrors: {
      marginBottom: '1rem',
    },
    FolderCreateModal_UserInline: {
      marginTop: '3rem',
    },
  }
})

const FolderCreateModal = ({ isOpen, onCancel, afterCreate, onTeamModalOpen }) => {
  const c = useStyles()
  const { user } = useCurrentUser()
  const [errors, setErrors] = useState()
  const handleOnCancel = useCallback(() => {
    setErrors(null)
    onCancel()
  }, [onCancel])
  const handleOnTeamModelOpen = useCallback(() => {
    onTeamModalOpen()
  }, [onTeamModalOpen])
  return (
    <Modal isOpen={isOpen}>
      <NewFolderIcon className={c.FolderCreateModal_NewFolderIcon} />
      <h2 className={c.FolderCreateModal_Header}>Add Folder</h2>
      <div className={c.FolderCreateModal_Text}>
        Create a team and share models with other teammates privately for collaboration.
      </div>
      <DisplayErrors
        errors={errors}
        className={c.FolderCreateModal_DisplayErrors}
        serverErrorMsg='Unable to create folder. Please try again later.'
      />
      <div
        className={classnames(c.FolderCreateModal_Row, {
          [c.FolderCreateModal_Row__hasError]: errors,
        })}
      >
        <CreateFolderForm
          onErrorReceived={setErrors}
          afterCreate={afterCreate}
          onCancel={handleOnCancel}
          onTeamModelOpen={handleOnTeamModelOpen}
          includeNameField
        />
      </div>
      <UserInline
        className={c.FolderCreateModal_UserInline}
        user={user}
        size={'3rem'}
        displayEmail
      />
    </Modal>
  )
}

export default FolderCreateModal
