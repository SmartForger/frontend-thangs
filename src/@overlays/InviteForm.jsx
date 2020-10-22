import React, { useCallback, useEffect, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { InviteFormForm, DisplayTeamFormErrors } from '@components'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import { overlayview } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    InviteForm: {
      width: '40vw',
      margin: '0 auto',
    },
    InviteForm_Header: {
      ...theme.text.headerText,
      marginBottom: '1rem',
    },
    InviteForm_Text: {
      ...theme.text.lightText,
    },
    InviteForm_Row: {
      display: 'flex',
      marginTop: '4.25rem',
    },
    InviteForm_Row__hasError: {
      marginTop: '1rem',
    },
    InviteForm_NewFolderIcon: {
      marginBottom: '1rem',
    },
    InviteForm_DisplayErrors: {
      marginBottom: '1rem',
    },
    InviteForm_UserInline: {
      marginTop: '3rem',
    },
  }
})

const InviteForm = ({ afterCreate, onTeamOverlayOpen, ...props }) => {
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

  useEffect(() => {
    overlayview('InviteForm')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.InviteForm}>
      <NewFolderIcon className={c.InviteForm_NewFolderIcon} />
      <h2 className={c.InviteForm_Header}>Create Team</h2>
      <div className={c.InviteForm_Text}>Create a team for your new shared folder.</div>
      <DisplayTeamFormErrors
        errors={errors}
        className={c.InviteForm_DisplayErrors}
        serverErrorMsg='Unable to create team. Please try again later.'
      />
      <div
        className={classnames(c.InviteForm_Row, {
          [c.InviteForm_Row__hasError]: errors,
        })}
      >
        <InviteFormForm
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

export default InviteForm
