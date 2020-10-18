import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    AddMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: 2,

      '& div': {
        display: 'flex',
        flexDirection: 'row',
      },
    },
    AddMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',
      outline: 'none',
    },
    AddMenu_Icon: {
      '& path': {
        fill: theme.colors.black[500],
        stroke: theme.colors.black[500],
      },
    },
    AddMenu_ItemLink: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
  }
})

const AddMenu = ({ folder = {}, sideBar = false }) => {
  const c = useStyles({ sideBar })
  const { dispatch } = useStoreon()

  const handleAddFolder = useCallback(() => {
    track('Add Menu - Create Folder')
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

  const handleUpload = useCallback(() => {
    track('Add Menu - Upload Models')
    dispatch(types.OPEN_OVERLAY, {
      overlayName: 'multiUpload',
      overlayData: {
        folderId: folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [dispatch, folder.id])

  return (
    <div className={c.AddMenu}>
      <Spacer size={'1rem'} />
      <div className={c.AddMenu_ItemLink} onClick={handleAddFolder}>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.AddMenu_Item}>
          <FolderIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Create Folder</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'.5rem'} />
      <div className={c.AddMenu_ItemLink} onClick={handleUpload}>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.AddMenu_Item}>
          <UploadIcon className={c.AddMenu_Icon} />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Upload Models</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'1rem'} />
    </div>
  )
}

export default AddMenu
