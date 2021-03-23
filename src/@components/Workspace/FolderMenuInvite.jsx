import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { Button, Contributors, Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as InviteIcon } from '@svg/icon-invite.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    FolderMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      minWidth: '18rem',

      '& div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    FolderMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      outline: 'none',

      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
    FolderMenu_Item__InviteSection: {
      justifyContent: 'space-between',
      marginLeft: '1.5rem',
      marginRight: '1.5rem',
    },
  }
})

const FolderMenuInvite = ({ folder = {}, members = [] }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const { setOverlay } = useOverlay()
  const currentUserId = authenticationService.getCurrentUserId()
  const hasDeletePermission = useMemo(() => {
    return (
      folder &&
      folder.creator &&
      folder.creator.id &&
      folder.creator.id.toString() === currentUserId.toString()
    )
  }, [currentUserId, folder])

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Edit Folder')
      setOverlay({
        isOpen: true,
        template: 'editFolder',
        data: {
          folder,
          type: 'folder',
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [folder, setOverlay]
  )

  const starFolder = useCallback(() => {
    track('File Menu - Star Folder')
    dispatch(types.LIKE_FOLDER, { id: folder.id, owner: folder.owner })
  }, [dispatch, folder.id, folder.owner])

  const addFolder = useCallback(() => {
    track('File Menu - Create Folder')
    setOverlay({
      isOpen: true,
      template: 'addFolder',
      data: {
        folder,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder, setOverlay])

  const removeFolder = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Delete Folder')
      setOverlay({
        isOpen: true,
        template: 'deleteFolder',
        data: {
          folder,
          type: 'folder',
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [folder, setOverlay]
  )

  const handleInviteUsers = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Invite Members')
      setOverlay({
        isOpen: true,
        template: 'inviteUsers',
        data: {
          folderId: folder.id,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [folder.id, setOverlay]
  )

  return (
    <div className={c.FolderMenu}>
      <Spacer size={'1rem'} />
      <MenuItem className={c.FolderMenu_Item} onClick={handleEdit}>
        <div>
          <Spacer size={'1.5rem'} />
          <EditIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Edit</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FolderMenu_Item} onClick={addFolder}>
        <div>
          <Spacer size={'1.5rem'} />
          <FolderIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Create Folder</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FolderMenu_Item} onClick={starFolder}>
        <div>
          <Spacer size={'1.5rem'} />
          <StarIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Add to starred</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      {hasDeletePermission && (
        <>
          <Divider spacing={'1rem'} />
          <MenuItem className={c.FolderMenu_Item} onClick={removeFolder}>
            <div>
              <Spacer size={'1.5rem'} />
              <DeleteIcon />
              <Spacer size={'.5rem'} />
              <SingleLineBodyText>Remove</SingleLineBodyText>
              <Spacer size={'1.5rem'} />
            </div>
          </MenuItem>
        </>
      )}
      <Divider spacing={'1rem'} />
      <MenuItem
        className={classnames(c.FolderMenu_Item, c.FolderMenu_Item__InviteSection)}
        onClick={handleInviteUsers}
      >
        <Contributors users={members} displayLength='3' />
        <Button>
          <InviteIcon />
          <Spacer size={'.5rem'} />
          Invite
        </Button>
      </MenuItem>
      <Spacer size={'1rem'} />
    </div>
  )
}

export default FolderMenuInvite
