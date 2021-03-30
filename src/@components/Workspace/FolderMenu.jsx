import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { useOverlay } from '@hooks'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    FolderMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: '2',

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
  }
})

const FolderMenu = ({ folder = {} }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const { setOverlay } = useOverlay()
  const currentUserId = authenticationService.getCurrentUserId()
  const hasDeletePermission = useMemo(
    () =>
      folder &&
      folder.creator &&
      folder.creator.id &&
      folder.creator.id.toString() === currentUserId.toString(),
    [currentUserId, folder]
  )

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      track('Folder Menu - Edit Folder')
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

  const handleStarFolder = useCallback(() => {
    track('Folder Menu - Star Folder')
    dispatch(types.LIKE_FOLDER, { id: folder.id, owner: folder.owner })
  }, [dispatch, folder.id, folder.owner])

  const handleAddFolder = useCallback(
    e => {
      e.preventDefault()
      track('Folder Menu - Create Folder')
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
    },
    [folder, setOverlay]
  )

  const handleDeleteFolder = useCallback(
    e => {
      e.preventDefault()
      track('Folder Menu - Delete Folder')
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
      <MenuItem className={c.FolderMenu_Item} onClick={handleAddFolder}>
        <div>
          <Spacer size={'1.5rem'} />
          <FolderIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Create Folder</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FolderMenu_Item} onClick={handleStarFolder}>
        <div>
          <Spacer size={'1.5rem'} />
          <StarIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Add to starred</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      {hasDeletePermission && (
        <>
          <Divider spacing={'.5rem'} />
          <MenuItem className={c.FolderMenu_Item} onClick={handleDeleteFolder}>
            <div>
              <Spacer size={'1.5rem'} />
              <DeleteIcon />
              <Spacer size={'.5rem'} />
              <SingleLineBodyText>Delete</SingleLineBodyText>
              <Spacer size={'1.5rem'} />
            </div>
          </MenuItem>
        </>
      )}
      <Spacer size={'1rem'} />
    </div>
  )
}

export default FolderMenu
