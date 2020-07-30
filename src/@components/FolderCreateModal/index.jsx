import React, { useCallback, useState } from 'react'
import Modal from '../Modal'
import { CreateFolderForm, DisplayErrors } from '../FolderForm'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
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

const FolderCreateModal = ({
  isOpen,
  onCancel,
  afterCreate,
  onTeamModalOpen,
  newTeamName,
}) => {
  const c = useStyles()
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
      <h2 className={c.FolderCreateModal_Header}>Create Folder</h2>
      <div className={c.FolderCreateModal_Text}>
        Create a folder to share models and collaborate with your teammates privately.
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
          defaultTeam={newTeamName}
          includeNameField
        />
      </div>
    </Modal>
  )
}

export default FolderCreateModal
