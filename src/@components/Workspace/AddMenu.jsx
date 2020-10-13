import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import * as types from '@constants/storeEventTypes'

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
      width: '100%',
      outline: 'none',
    },
    ContextMenu_Icon: {
      '& path': {
        fill: theme.colors.black[500],
        stroke: theme.colors.black[500],
      },
    },
    ContextMenu_ItemLink: {
      '&:hover': {
        backgroundColor: ({ sideBar }) =>
          sideBar ? 'rgba(0, 0, 0, 0.05)' : 'transparent',

        '& span': {
          textDecoration: ({ sideBar }) => (sideBar ? undefined : 'underline'),
        },
      },
    },
  }
})

const AddMenu = ({ folder = {}, sideBar = false }) => {
  const c = useStyles({ sideBar })
  const { dispatch } = useStoreon()

  const handleAddFolder = useCallback(
    () =>
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'addFolder',
        overlayData: {
          folder,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      }),
    [dispatch, folder]
  )

  const handleUpload = useCallback(
    () =>
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'upload',
        overlayData: { folderId: folder.id },
      }),
    [dispatch, folder.id]
  )

  return (
    <div className={c.ContextMenu}>
      <Spacer size={'1rem'} />
      <div className={c.ContextMenu_ItemLink} onClick={handleAddFolder}>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.ContextMenu_Item}>
          <PlusIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Add Folder</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'.5rem'} />
      <div className={c.ContextMenu_ItemLink} onClick={handleUpload}>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.ContextMenu_Item}>
          <UploadIcon className={c.ContextMenu_Icon} />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Upload Model</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      {/* <Spacer size={'.5rem'} />
      <div>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.ContextMenu_Item} onClick={handleUpload}>
          <UploadIcon className={c.ContextMenu_Icon} />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Upload Folder - Coming Soon...</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div> */}
      <Spacer size={'1rem'} />
    </div>
  )
}

export default AddMenu
