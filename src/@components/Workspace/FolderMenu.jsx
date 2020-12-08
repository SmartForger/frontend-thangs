import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    FolderMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: 2,

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
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'editFolder',
        overlayData: {
          folder,
          type: 'folder',
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [dispatch, folder]
  )

  const starFolder = useCallback(() => {
    track('File Menu - Star Folder')
    dispatch(types.LIKE_FOLDER, { id: folder.id, owner: folder.owner })
  }, [dispatch, folder.id, folder.owner])

  const addFolder = useCallback(() => {
    track('File Menu - Create Folder')
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'addFolder',
      overlayData: {
        folder,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [dispatch, folder])

  const removeFolder = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Delete Folder')
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'deleteFolder',
        overlayData: {
          folder,
          type: 'folder',
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [dispatch, folder]
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
      <Spacer size={'.5rem'} />
      {hasDeletePermission && (
        <>
          <Divider spacing={'.5rem'} />
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
      <Spacer size={'1rem'} />
    </div>
  )
}

export default FolderMenu
