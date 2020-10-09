import React from 'react'
import { SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'

const useStyles = createUseStyles(theme => {
  return {
    ContextMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: 2,

      '& div': {
        display: 'flex',
        flexDirection: 'row',
      },
    },
    ContextMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
    ContextMenu_Icon: {
      '& path': {
        fill: theme.colors.black[500],
        stroke: theme.colors.black[500],
      },
    },
  }
})

const AddContextMenu = () => {
  const c = useStyles({})

  return (
    <ContextMenu className={c.ContextMenu} id='Add_Menu'>
      <Spacer size={'1rem'} />
      <div>
        <Spacer size={'1.5rem'} />
        <MenuItem
          className={c.ContextMenu_Item}
          onClick={() => console.log('Menu Click - New Folder')}
        >
          <PlusIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Add Folder</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'.5rem'} />
      <div>
        <Spacer size={'1.5rem'} />
        <MenuItem
          className={c.ContextMenu_Item}
          onClick={() => console.log('Menu Click - New Folder')}
        >
          <UploadIcon className={c.ContextMenu_Icon} />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Upload Model</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'.5rem'} />
      <div>
        <Spacer size={'1.5rem'} />
        <MenuItem
          className={c.ContextMenu_Item}
          onClick={() => console.log('Menu Click - New Folder')}
        >
          <UploadIcon className={c.ContextMenu_Icon} />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Upload Folder</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'1rem'} />
    </ContextMenu>
  )
}

export default AddContextMenu
