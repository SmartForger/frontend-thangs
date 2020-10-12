import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'

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
        alignItems: 'flex-end',
      },
    },
    ContextMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      outline: 'none',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }
})

const FileContextMenu = ({ id, model, folder, type, postId = '' }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      if (type === 'model') {
        dispatch(types.OPEN_OVERLAY, {
          overlayName: 'editModel',
          overlayData: {
            model,
            type,
            animateIn: true,
            windowed: true,
          },
        })
      } else if (type === 'folder') {
        dispatch(types.OPEN_OVERLAY, {
          overlayName: 'editFolder',
          overlayData: {
            folder,
            type,
            animateIn: true,
            windowed: true,
            dialogue: true,
          },
        })
      }
    },
    [dispatch, folder, model, type]
  )

  const downloadModel = useCallback(() => {
    if (type === 'model') {
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        id,
        onFinish: downloadUrl => {
          window.location.assign(downloadUrl)
        },
      })
    }
  }, [dispatch, id, type])

  const starFile = useCallback(() => {
    if (type === 'model') {
      const currentUserId = authenticationService.getCurrentUserId()
      dispatch(types.LIKE_MODEL, { id, currentUserId: currentUserId, owner: model.owner })
    } else if (type === 'folder') {
      dispatch(types.LIKE_FOLDER, { id, owner: folder.owner })
    }
  }, [dispatch, folder, id, model, type])

  const addFolder = useCallback(() => {
    dispatch(types.OPEN_OVERLAY, { overlayName: 'createFolder' })
  }, [dispatch])

  const removeFile = useCallback(
    e => {
      e.preventDefault()
      if (type === 'model') {
        dispatch(types.OPEN_OVERLAY, {
          overlayName: 'deleteModel',
          overlayData: {
            model,
            type,
            animateIn: true,
            windowed: true,
            dialogue: true,
          },
        })
      } else if (type === 'folder') {
        dispatch(types.OPEN_OVERLAY, {
          overlayName: 'deleteFolder',
          overlayData: {
            folder,
            type,
            animateIn: true,
            windowed: true,
            dialogue: true,
          },
        })
      }
    },
    [dispatch, folder, model, type]
  )

  return (
    <ContextMenu className={c.ContextMenu} id={`File_Menu_${id}${postId}`}>
      <Spacer size={'1rem'} />
      <MenuItem className={c.ContextMenu_Item} onClick={handleEdit}>
        <div>
          <Spacer size={'1.5rem'} />
          <EditIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Edit</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.ContextMenu_Item} onClick={downloadModel}>
        <div>
          <Spacer size={'1.5rem'} />
          <DownloadIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Download</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.ContextMenu_Item} onClick={starFile}>
        <div>
          <Spacer size={'1.5rem'} />
          <StarIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Add to starred</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Divider spacing={'1rem'} />
      <MenuItem className={c.ContextMenu_Item} onClick={addFolder}>
        <div>
          <Spacer size={'1.5rem'} />
          <PlusIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>New Folder</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.ContextMenu_Item} onClick={removeFile}>
        <div>
          <Spacer size={'1.5rem'} />
          <DeleteIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Remove</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'1rem'} />
    </ContextMenu>
  )
}

export default FileContextMenu
