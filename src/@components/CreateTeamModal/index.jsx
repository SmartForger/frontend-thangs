import React, { useCallback, useState } from 'react'
import { CreateTeamForm, DisplayTeamFormErrors, Modal } from '@components'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    CreateTeamModal: {},
    CreateTeamModal_Header: {
      ...theme.mixins.text.headerText,
      marginBottom: '1rem',
    },
    CreateTeamModal_Text: {
      ...theme.mixins.text.lightText,
    },
    CreateTeamModal_Row: {
      display: 'flex',
      marginTop: '4.25rem',
    },
    CreateTeamModal_Row__hasError: {
      marginTop: '1rem',
    },
    CreateTeamModal_NewFolderIcon: {
      marginBottom: '1rem',
    },
    CreateTeamModal_DisplayErrors: {
      marginBottom: '1rem',
    },
    CreateTeamModal_UserInline: {
      marginTop: '3rem',
    },
  }
})

const CreateTeamModal = ({
  isOpen,
  onCancel,
  afterCreate,
  onTeamModalOpen,
  newFolderData,
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
  const handleAfterCreate = useCallback(
    newTeamName => {
      setErrors(null)
      afterCreate(newTeamName)
    },
    [afterCreate]
  )
  return (
    <Modal isOpen={isOpen}>
      <NewFolderIcon className={c.CreateTeamModal_NewFolderIcon} />
      <h2 className={c.CreateTeamModal_Header}>Create Team</h2>
      <div className={c.CreateTeamModal_Text}>
        Create a team for your new shared folder.
      </div>
      <DisplayTeamFormErrors
        errors={errors}
        className={c.CreateTeamModal_DisplayErrors}
        serverErrorMsg='Unable to create team. Please try again later.'
      />
      <div
        className={classnames(c.CreateTeamModal_Row, {
          [c.CreateTeamModal_Row__hasError]: errors,
        })}
      >
        <CreateTeamForm
          onErrorReceived={setErrors}
          afterCreate={handleAfterCreate}
          onCancel={handleOnCancel}
          onTeamModelOpen={handleOnTeamModelOpen}
          newFolderData={newFolderData}
          includeNameField
        />
      </div>
    </Modal>
  )
}

export default CreateTeamModal
