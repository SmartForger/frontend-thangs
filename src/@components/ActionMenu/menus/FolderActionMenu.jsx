import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { DotStackActionMenu, ContextActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as OpenIcon } from '@svg/external-link.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { FOLDER_MENU_OPTIONS } from '@constants/menuOptions'
import * as types from '@constants/storeEventTypes'
import { useActionMenu } from '@contexts/ActionMenu'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    FolderActionMenu: {
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    FolderActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    FolderActionMenu__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    FolderActionMenu__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const FolderActionMenu = ({
  folder = {},
  omitOptions = [],
  isStaticBackground = false,
  onChange = noop,
  menuId = '',
}) => {
  const { setOverlay } = useOverlay()
  const { dispatch } = useStoreon()
  const { contextMenuData } = useActionMenu()
  const c = useStyles({})
  const ActionMenuComponent = menuId ? ContextActionMenu : DotStackActionMenu
  const currentFolder = contextMenuData[menuId]?.data || folder

  const options = [
    {
      label: 'Edit',
      Icon: OpenIcon,
      value: FOLDER_MENU_OPTIONS.EDIT,
    },
    {
      label: 'Create Folder',
      Icon: FolderIcon,
      value: FOLDER_MENU_OPTIONS.CREATE_FOLDER,
    },
    {
      label: 'Add to Starred',
      Icon: StarIcon,
      value: FOLDER_MENU_OPTIONS.ADD_TO_STARRED,
    },
    {
      label: 'Delete',
      Icon: DeleteIcon,
      value: FOLDER_MENU_OPTIONS.DELETE,
    },
  ].filter(opt => !omitOptions.includes(opt.value))

  const handleEdit = useCallback(() => {
    track('Folder Menu - Edit Folder')
    setOverlay({
      isOpen: true,
      template: 'editFolder',
      data: {
        folder: currentFolder,
        type: 'folder',
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [currentFolder, setOverlay])

  const handleStarFolder = useCallback(() => {
    track('Folder Menu - Star Folder')
    dispatch(types.LIKE_FOLDER, { id: currentFolder.id, owner: currentFolder.owner })
  }, [dispatch, currentFolder])

  const handleAddFolder = useCallback(() => {
    track('Folder Menu - Create Folder')
    setOverlay({
      isOpen: true,
      template: 'addFolder',
      data: {
        folder: currentFolder,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [currentFolder, setOverlay])

  const handleDeleteFolder = useCallback(() => {
    track('Folder Menu - Delete Folder')
    setOverlay({
      isOpen: true,
      template: 'deleteFolder',
      data: {
        folder: currentFolder,
        type: 'folder',
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [currentFolder, setOverlay])

  const handleOnChange = value => {
    switch (value) {
      case FOLDER_MENU_OPTIONS.EDIT:
        return handleEdit()
      case FOLDER_MENU_OPTIONS.CREATE_FOLDER:
        return handleAddFolder()
      case FOLDER_MENU_OPTIONS.ADD_TO_STARRED:
        return handleStarFolder()
      case FOLDER_MENU_OPTIONS.DELETE:
        return handleDeleteFolder()
      default:
        return onChange(value)
    }
  }

  return (
    <ActionMenuComponent
      onChange={handleOnChange}
      actionMenuTitle='Select action'
      alignItems='left'
      isStaticBackground={isStaticBackground}
      options={options}
      menuComponentProps={{ className: c.FolderActionMenu }}
      menuId={menuId}
    />
  )
}

export default FolderActionMenu
