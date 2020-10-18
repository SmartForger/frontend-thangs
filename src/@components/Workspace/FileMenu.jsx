import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as FolderIcon } from '@svg/icon-folder.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    FileMenu: {
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
    FileMenu_Item: {
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

const FileMenu = ({ model = {}, folder = {}, type }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const currentUserId = authenticationService.getCurrentUserId()
  const hasDeletePermission = useMemo(() => {
    if (type === 'model') return currentUserId.toString() === model.owner.id.toString()
    if (type === 'folder')
      return currentUserId.toString() === folder.creator.id.toString()
  }, [currentUserId, folder, model, type])

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      if (type === 'model') {
        track('File Menu - Edit Model')
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
        track('File Menu - Edit Folder')
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
      track('File Menu - Download Model')
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        id: model.id,
        onFinish: downloadUrl => {
          window.location.assign(downloadUrl)
        },
      })
    }
  }, [dispatch, model.id, type])

  const starFile = useCallback(() => {
    if (type === 'model') {
      track('File Menu - Star Model')
      dispatch(types.LIKE_MODEL, {
        id: model.id,
        currentUserId: currentUserId,
        owner: model.owner,
      })
    } else if (type === 'folder') {
      track('File Menu - Star Folder')
      dispatch(types.LIKE_FOLDER, { id: folder.id, owner: folder.owner })
    }
  }, [currentUserId, dispatch, folder.id, folder.owner, model.id, model.owner, type])

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

  const removeFile = useCallback(
    e => {
      e.preventDefault()
      if (type === 'model') {
        track('File Menu - Delete Model')
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
        track('File Menu - Delete Folder')
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
    <div className={c.FileMenu}>
      <Spacer size={'1rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleEdit}>
        <div>
          <Spacer size={'1.5rem'} />
          <EditIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Edit</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={addFolder}>
        <div>
          <Spacer size={'1.5rem'} />
          <FolderIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Create Folder</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      {type === 'model' && (
        <>
          <MenuItem className={c.FileMenu_Item} onClick={downloadModel}>
            <div>
              <Spacer size={'1.5rem'} />
              <DownloadIcon />
              <Spacer size={'.5rem'} />
              <SingleLineBodyText>Download</SingleLineBodyText>
              <Spacer size={'1.5rem'} />
            </div>
          </MenuItem>
          <Spacer size={'.5rem'} />
        </>
      )}
      <MenuItem className={c.FileMenu_Item} onClick={starFile}>
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
          <MenuItem className={c.FileMenu_Item} onClick={removeFile}>
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

export default FileMenu
