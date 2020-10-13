import React, { useCallback, useState } from 'react'
import { useStoreon } from 'storeon/react'
import { CreateFolderForm, DisplayFolderFormErrors } from '@components'
import { ReactComponent as NewFolderIcon } from '@svg/folder-plus-icon.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

const useStyles = createUseStyles(theme => {
  return {
    CreateFolder: {
      width: '100%',
      margin: '4rem auto',
    },
    CreateFolder_Header: {
      ...theme.text.uploadFrameText,
      color: theme.colors.purple[900],
      marginBottom: '1rem',
    },
    CreateFolder_Text: {
      ...theme.text.lightText,
    },
    CreateFolder_Row: {
      display: 'flex',
      marginTop: '3.25rem',
    },
    CreateFolder_Row__hasError: {
      marginTop: '1rem',
    },
    CreateFolder_NewFolderIcon: {
      marginTop: '1rem',
      marginBottom: '.5rem',
    },
    CreateFolder_DisplayErrors: {
      marginBottom: '1rem',
    },
    CreateFolder_UserInline: {
      marginTop: '3rem',
    },
  }
})

const CreateFolder = ({ afterCreate }) => {
  const { dispatch } = useStoreon()
  const c = useStyles()
  const [errors, setErrors] = useState()
  const handleonTeamOverlayOpen = useCallback(
    folderData => {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'createTeam',
        overlayData: { afterCreate, ...folderData },
      })
    },
    [afterCreate, dispatch]
  )
  return (
    <div className={c.CreateFolder}>
      <NewFolderIcon className={c.CreateFolder_NewFolderIcon} />
      <h2 className={c.CreateFolder_Header}>Create Folder</h2>
      <div className={c.CreateFolder_Text}>
        Create a folder to share models and collaborate with your teammates privately.
      </div>
      <DisplayFolderFormErrors
        errors={errors}
        className={c.CreateFolder_DisplayErrors}
        serverErrorMsg='Unable to create folder. Please try again later.'
      />
      <div
        className={classnames(c.CreateFolder_Row, {
          [c.CreateFolder_Row__hasError]: errors,
        })}
      >
        <CreateFolderForm
          onErrorReceived={setErrors}
          afterCreate={afterCreate}
          onTeamOverlayOpen={handleonTeamOverlayOpen}
          includeNameField
        />
      </div>
    </div>
  )
}

export default CreateFolder