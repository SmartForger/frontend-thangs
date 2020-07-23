import React, { useState } from 'react'
import { Modal } from '../Modal'
import { CreateFolderForm, DisplayErrors } from '../FolderForm'
import { ReactComponent as NewFolderIcon } from '../../@svg/folder-plus-icon.svg'
import { headerText, lightText } from '../../@style/text'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    FolderCreateModal: {},
    FolderCreateModal_Header: {
      ...headerText,
      marginBottom: '1rem',
    },
    FolderCreateModal_Text: {
      ...lightText,
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
  }
})

export function FolderCreateModal({ isOpen, onCancel, afterCreate }) {
  const c = useStyles()
  const [errors, setErrors] = useState()
  return (
    <Modal isOpen={isOpen}>
      <NewFolderIcon className={c.FolderCreateModal_NewFolderIcon} />
      <h2 className={c.FolderCreateModal_Header}>Add Folder</h2>
      <div className={c.FolderCreateModal_Text}>
        Create a team and share models with other teamates privately for collaboration.
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
          onCancel={onCancel}
          includeNameField
        />
      </div>
    </Modal>
  )
}
