import React, { useCallback } from 'react'
import { SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@physna/voxel-ui'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { useOverlay } from '@hooks'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    AddMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: '2',
      width: '100%',

      '& div': {
        display: 'flex',
        flexDirection: 'row',
      },

      [md]: {
        width: 'auto',
      },
    },
    AddMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      width: '100%',
      outline: 'none',
      justifyContent: 'center',
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

const AddMenu = ({ folder = {} }) => {
  const c = useStyles({})
  const { setOverlay } = useOverlay()

  const handleAddFolder = useCallback(() => {
    track('Add Menu - Create Folder')
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

  const handleUpload = useCallback(() => {
    track('Add Menu - Upload Models')
    setOverlay({
      isOpen: true,
      template: 'multiUpload',
      data: {
        folderId: folder.id,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [folder, setOverlay])

  return (
    <div className={c.AddMenu}>
      <Spacer size={'1rem'} />
      <div className={c.AddMenu_ItemLink}>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.AddMenu_Item} onClick={handleAddFolder}>
          <FolderIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Create Folder</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'.5rem'} />
      <div className={c.AddMenu_ItemLink}>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.AddMenu_Item} onClick={handleUpload}>
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
