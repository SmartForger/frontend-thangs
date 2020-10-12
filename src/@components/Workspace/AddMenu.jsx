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

const AddMenu = ({ folder = {} }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  debugger
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
      <div>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.ContextMenu_Item} onClick={handleAddFolder}>
          <PlusIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Add Folder</SingleLineBodyText>
        </MenuItem>
        <Spacer size={'1.5rem'} />
      </div>
      <Spacer size={'.5rem'} />
      <div>
        <Spacer size={'1.5rem'} />
        <MenuItem className={c.ContextMenu_Item} onClick={handleUpload}>
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
