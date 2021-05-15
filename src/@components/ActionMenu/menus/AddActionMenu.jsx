import React, { useCallback } from 'react'
import { DotStackActionMenu, ContextActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { ADD_MENU_OPTIONS } from '@constants/menuOptions'
import { useActionMenu } from '@contexts/ActionMenu'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    AddActionMenu: {
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    AddActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    AddActionMenu__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    AddActionMenu__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const AddActionMenu = ({ folder = {}, menuId = '' }) => {
  const { setOverlay } = useOverlay()
  const c = useStyles({})
  const { contextMenuData } = useActionMenu()
  const ActionMenuComponent = menuId ? ContextActionMenu : DotStackActionMenu
  const currentFolder = contextMenuData[menuId]?.data || folder

  const options = [
    {
      label: 'Create Folder',
      Icon: FolderIcon,
      value: ADD_MENU_OPTIONS.CREATE_FOLDER,
    },
    {
      label: 'Upload Models',
      Icon: UploadIcon,
      value: ADD_MENU_OPTIONS.UPLOAD_MODELS,
    },
  ]

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

  const handleUploadModels = useCallback(() => {
    track('Add Menu - Upload Models')
    setOverlay({
      isOpen: true,
      template: 'multiUpload',
      data: {
        folderId: currentFolder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [currentFolder, setOverlay])

  const handleOnChange = value => {
    switch (value) {
      case ADD_MENU_OPTIONS.CREATE_FOLDER:
        return handleAddFolder()
      case ADD_MENU_OPTIONS.UPLOAD_MODELS:
        return handleUploadModels()
      default:
        break
    }
  }

  return (
    <ActionMenuComponent
      menuId={menuId}
      onChange={handleOnChange}
      actionMenuTitle='Add'
      alignItems='left'
      options={options}
      menuComponentProps={{ className: c.AddActionMenu }}
    />
  )
}

export default AddActionMenu
