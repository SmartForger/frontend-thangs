import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import {
  Button,
  DropdownItem,
  DropdownMenu,
  Spinner,
  useFlashNotification,
} from '@components'
import { ReactComponent as FolderIcon } from '@svg/folder-icon.svg'
import { ReactComponent as TrashCanIcon } from '@svg/trash-can-icon.svg'
import { ReactComponent as FolderManagementIcon } from '@svg/folder-management-icon.svg'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import classnames from 'classnames'
import { createUseStyles } from '@style'

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

const DeleteMenu = ({ dispatch, folderId, folders }) => {
  const c = useStyles()
  const { navigateWithFlash } = useFlashNotification()

  const handleDelete = useCallback(
    async e => {
      e.preventDefault()
      dispatch('delete-folder', {
        folderId: folderId,
        onFinish: () => {
          navigateWithFlash('/home', 'Folder deleted')
        },
      })
    },
    [dispatch, folderId, navigateWithFlash]
  )

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

const ManageUsers = ({ dispatch, folder }) => {
  const c = useStyles()
  const { setFlash } = useFlashNotification()

  const afterInvite = useCallback(() => {
    setFlash(
      'If the email addresses belong to registered Thangs users, they will have access to your folder'
    )
    dispatch('close-modal')
  }, [dispatch, setFlash])

  return (
    <>
      <Button
        text
        className={c.Breadcrumbs_ManagementButton}
        onClick={() =>
          dispatch('open-modal', {
            modalName: 'folderManagement',
            modalData: { afterInvite, folder },
          })
        }
      >
        <FolderManagementIcon />
      </Button>
    </>
  )
}

const Breadcrumbs = ({ modelsCount, folder, className }) => {
  const { dispatch, folders } = useStoreon('folders')
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
        <DeleteMenu folderId={folder.id} dispatch={dispatch} folders={folders} />
        <ManageUsers folder={folder} dispatch={dispatch} />
      </div>
    </div>
  )
}

export default Breadcrumbs
