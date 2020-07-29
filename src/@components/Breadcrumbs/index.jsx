import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDeleteFolder } from '../../@customHooks/Folders'
import { DropdownMenu, DropdownItem } from '../DropdownMenu'
import FolderManagementModal from '../FolderManagementModal'
import { useFlashNotification } from '../Flash'
import { Button } from '../Button'
import { ReactComponent as FolderIcon } from '../../@svg/folder-icon.svg'
import { ReactComponent as TrashCanIcon } from '../../@svg/trash-can-icon.svg'
import { ReactComponent as FolderManagementIcon } from '../../@svg/folder-management-icon.svg'
import { Spinner } from '../Spinner'
import { ReactComponent as ErrorIcon } from '../../@svg/error-triangle.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import {useStoreon} from "storeon/react";

const useStyles = createUseStyles(theme => {
  return {
    Breadcrumbs: {},
    Breadcrumbs_FolderIcon: {
      color: theme.colors.blue[500],
      marginRight: '1rem',
    },
    Breadcrumbs_Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    Breadcrumbs_Row: {
      display: 'flex',
      alignItems: 'center',
    },
    Breadcrumbs_Arrow: {
      ...theme.mixins.text.smallHeaderText,

      '&:before': {
        content: '">"',
        marginLeft: '1rem',
        marginRight: '1.5rem',
      },
    },
    Breadcrumbs_ErrorIcon: {
      width: '1rem',
      height: '1rem',
    },
    Breadcrumbs_DropdownMenu: {
      marginLeft: '1rem',
    },
    Breadcrumbs_ManagementButton: {
      marginLeft: '1.5rem',
      display: 'flex',
      alignItems: 'center',
    },
    Breadcrumbs_Link: {
      ...theme.mixins.text.breadcrumbTextLight,
    },
    Breadcrumbs_ModelCount: {
      marginLeft: '.25rem',
    },
  }
})

const DeleteMenu = ({ folderId }) => {
  const { dispatch, folders } = useStoreon('folders')
  const c = useStyles()
  const { navigateWithFlash } = useFlashNotification()

  const handleDelete = async e => {
    e.preventDefault()
    dispatch('delete-folder', {folderId: folderId, onFinish: () => {navigateWithFlash('/home', 'Folder deleted')}})
  }

  return (
    <DropdownMenu className={c.Breadcrumbs_DropdownMenu}>
      <DropdownItem to='#' onClick={handleDelete}>
        {folders.isLoading ? (
          <Spinner className={c.Breadcrumbs_Spinner} />
        ) : folders.loadError ? (
          <ErrorIcon className={c.Breadcrumbs_ErrorIcon} />
        ) : (
          <TrashCanIcon />
        )}

        <span>Delete Folder</span>
      </DropdownItem>
    </DropdownMenu>
  )
}

const ManageUsers = ({ folder }) => {
  const c = useStyles()
  const [isOpen, setIsOpen] = useState()
  const { setFlash } = useFlashNotification()

  const afterInvite = () => {
    setFlash(
      'If the email addresses belong to registered Thangs users, they will have access to your folder'
    )
    setIsOpen(false)
  }
  const handleCancel = () => setIsOpen(false)
  const handleClick = () => setIsOpen(true)

  return (
    <>
      <Button text className={c.Breadcrumbs_ManagementButton} onClick={handleClick}>
        <FolderManagementIcon />
      </Button>
      <FolderManagementModal
        folder={folder}
        onCancel={handleCancel}
        afterInvite={afterInvite}
        isOpen={isOpen}
      />
    </>
  )
}

const Breadcrumbs = ({ modelsCount, folder, className }) => {
  const c = useStyles()
  return (
    <div className={classnames(className, c.Breadcrumbs_Row)}>
      <Link className={c.Breadcrumbs_Link} to='/home'>
        <div className={c.Breadcrumbs_Row}>
          <div>All Models</div>{' '}
          <div className={c.Breadcrumbs_ModelCount}>{modelsCount}</div>
        </div>
      </Link>
      <div className={classnames(c.Breadcrumbs_Row, c.Breadcrumbs_Arrow)}>
        <FolderIcon className={c.Breadcrumbs_FolderIcon} />
        <div>{folder.name}</div>
        <DeleteMenu folderId={folder.id} />
        <ManageUsers folder={folder} />
      </div>
    </div>
  )
}

export default Breadcrumbs
