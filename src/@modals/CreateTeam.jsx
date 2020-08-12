import React, { useCallback, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { CreateTeamForm, DisplayTeamFormErrors } from '@components'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    CreateTeam: {
      width: '40vw',
      margin: '0 auto',
    },
    CreateTeam_Header: {
      ...theme.mixins.text.uploadFrameText,
      color: theme.colors.purple[900],
      marginBottom: '1rem',
    },
    CreateTeam_Text: {
      ...theme.mixins.text.lightText,
    },
    CreateTeam_Row: {
      display: 'flex',
      marginTop: '3.25rem',
    },
    CreateTeam_Row__hasError: {
      marginTop: '1rem',
    },
    CreateTeam_NewFolderIcon: {
      marginTop: '1rem',
      marginBottom: '.5rem',
    },
    CreateTeam_DisplayErrors: {
      marginBottom: '1rem',
    },
    CreateTeam_UserInline: {
      marginTop: '3rem',
    },
  }
})

const CreateTeam = ({ afterCreate, onTeamModalOpen, ...props }) => {
  const { dispatch } = useStoreon()
  const c = useStyles()
  const [errors, setErrors] = useState()
  const handleOnCancel = useCallback(() => {
    dispatch('open-modal', { modalName: 'createFolder' })
  }, [dispatch])
  const handleOnTeamModalOpen = useCallback(() => {
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
    <div className={c.CreateTeam}>
      <NewFolderIcon className={c.CreateTeam_NewFolderIcon} />
      <h2 className={c.CreateTeam_Header}>Create Team</h2>
      <div className={c.CreateTeam_Text}>Create a team for your new shared folder.</div>
      <DisplayTeamFormErrors
        errors={errors}
        className={c.CreateTeam_DisplayErrors}
        serverErrorMsg='Unable to create team. Please try again later.'
      />
      <div
        className={classnames(c.CreateTeam_Row, {
          [c.CreateTeam_Row__hasError]: errors,
        })}
      >
        <CreateTeamForm
          onErrorReceived={setErrors}
          afterCreate={handleAfterCreate}
          onCancel={handleOnCancel}
          onTeamModalOpen={handleOnTeamModalOpen}
          newFolderData={props}
          includeNameField
        />
      </div>
    </div>
  )
}

export default CreateTeam
