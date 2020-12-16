import React, { useCallback } from 'react'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import { SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import * as types from '@constants/storeEventTypes'
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
      zIndex: 2,
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

const AddMenu = () => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const handleAddFolder = useCallback(
    (_e, data = {}) => {
      track('Add Menu - Create Folder')
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'addFolder',
        overlayData: {
          folder: data.folder,
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [dispatch]
  )

  const handleUpload = useCallback(
    (_e, data = {}) => {
      track('Add Menu - Upload Models')
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'multiUpload',
        overlayData: {
          folderId: R.path(['folder', 'id'], data),
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [dispatch]
  )

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
