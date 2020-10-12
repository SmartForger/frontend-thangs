import React, { useCallback, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { InviteUsersForm, DisplayTeamFormErrors } from '@components'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    InviteUsers: {
      width: '40vw',
      margin: '0 auto',
    },
    InviteUsers_Header: {
      ...theme.text.headerText,
      marginBottom: '1rem',
    },
    InviteUsers_Text: {
      ...theme.text.lightText,
    },
    InviteUsers_Row: {
      display: 'flex',
      marginTop: '4.25rem',
    },
    InviteUsers_Row__hasError: {
      marginTop: '1rem',
    },
    InviteUsers_NewFolderIcon: {
      marginBottom: '1rem',
    },
    InviteUsers_DisplayErrors: {
      marginBottom: '1rem',
    },
    InviteUsers_UserInline: {
      marginTop: '3rem',
    },
  }
})

const InviteUsers = ({ afterCreate, onTeamOverlayOpen, ...props }) => {
  const { dispatch } = useStoreon()
  const c = useStyles()
  const [errors, setErrors] = useState()
  const handleOnCancel = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, { overlayName: 'createFolder' })
  }, [dispatch])
  const handleonTeamOverlayOpen = useCallback(() => {
    onTeamOverlayOpen()
  }, [onTeamOverlayOpen])
  const handleAfterCreate = useCallback(
    newTeamName => {
      setErrors(null)
      afterCreate(newTeamName)
    },
    [afterCreate]
  )
  return (
    <div className={c.InviteUsers}>
      <NewFolderIcon className={c.InviteUsers_NewFolderIcon} />
      <h2 className={c.InviteUsers_Header}>Create Team</h2>
      <div className={c.InviteUsers_Text}>Create a team for your new shared folder.</div>
      <DisplayTeamFormErrors
        errors={errors}
        className={c.InviteUsers_DisplayErrors}
        serverErrorMsg='Unable to create team. Please try again later.'
      />
      <div
        className={classnames(c.InviteUsers_Row, {
          [c.InviteUsers_Row__hasError]: errors,
        })}
      >
        <InviteUsersForm
          onErrorReceived={setErrors}
          afterCreate={handleAfterCreate}
          onCancel={handleOnCancel}
          onTeamOverlayOpen={handleonTeamOverlayOpen}
          newFolderData={props}
          includeNameField
        />
      </div>
    </div>
  )
}

export default InviteUsers
