import React, { useCallback, useState } from 'react'
import Modal from '../Modal'
import { CreateTeamForm, DisplayErrors } from '../TeamForm'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    TeamCreateModal: {},
    TeamCreateModal_Header: {
      ...theme.mixins.text.headerText,
      marginBottom: '1rem',
    },
    TeamCreateModal_Text: {
      ...theme.mixins.text.lightText,
    },
    TeamCreateModal_Row: {
      display: 'flex',
      marginTop: '4.25rem',
    },
    TeamCreateModal_Row__hasError: {
      marginTop: '1rem',
    },
    TeamCreateModal_NewFolderIcon: {
      marginBottom: '1rem',
    },
    TeamCreateModal_DisplayErrors: {
      marginBottom: '1rem',
    },
    TeamCreateModal_UserInline: {
      marginTop: '3rem',
    },
  }
})

const TeamCreateModal = ({ isOpen, onCancel, afterCreate, onTeamModalOpen }) => {
  const c = useStyles()
  const [errors, setErrors] = useState()
  const handleOnCancel = useCallback(() => {
    setErrors(null)
    onCancel()
  }, [onCancel])
  const handleOnTeamModelOpen = useCallback(() => {
    onTeamModalOpen()
  }, [onTeamModalOpen])
  const handleAfterCreate = useCallback(() => {
    setErrors(null)
    afterCreate()
  }, [afterCreate])
  return (
    <Modal isOpen={isOpen}>
      <NewFolderIcon className={c.TeamCreateModal_NewFolderIcon} />
      <h2 className={c.TeamCreateModal_Header}>Add Team</h2>
      <div className={c.TeamCreateModal_Text}>
        Create a team and share models with other teammates privately for collaboration.
      </div>
      <DisplayErrors
        errors={errors}
        className={c.TeamCreateModal_DisplayErrors}
        serverErrorMsg='Unable to create team. Please try again later.'
      />
      <div
        className={classnames(c.TeamCreateModal_Row, {
          [c.TeamCreateModal_Row__hasError]: errors,
        })}
      >
        <CreateTeamForm
          onErrorReceived={setErrors}
          afterCreate={handleAfterCreate}
          onCancel={handleOnCancel}
          onTeamModelOpen={handleOnTeamModelOpen}
          includeNameField
        />
      </div>
    </Modal>
  )
}

export default TeamCreateModal
