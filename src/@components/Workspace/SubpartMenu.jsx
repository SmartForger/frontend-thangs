import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as OpenIcon } from '@svg/external-link.svg'
import { ReactComponent as ShareIcon } from '@svg/icon-sharedfolder.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  return {
    SubpartMenu: {
      backgroundColor: theme.colors.white[400],
      boxShadow: '0px 8px 20px 0px rgba(0, 0, 0, 0.16)',
      borderRadius: '.5rem',
      zIndex: '2',

      '& div': {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      },
    },
    SubpartMenu_Item: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      cursor: 'pointer',
      outline: 'none',

      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
      },
    },
    SubpartMenu_OpenIcon: {
      marginLeft: '-4px',
      transform: 'translateX(2px)',

      '& path': {
        fill: '#000',
      },
    },
  }
})

const SubpartMenu = ({ model }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const { setOverlay } = useOverlay()
  const currentUserId = authenticationService.getCurrentUserId()
  const hasDeletePermission = useMemo(() => {
    return (
      model &&
      model.owner &&
      model.owner.id &&
      model.owner.id.toString() === currentUserId.toString()
    )
  }, [model, currentUserId])

  const handleNewVersion = useCallback(
    e => {
      e.preventDefault()
      track()
      setOverlay({
        isOpen: true,
        template: 'multiUpload',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          model: model,
          action: 'update',
        },
      })
    },
    [model, setOverlay]
  )

  const handleNewPart = useCallback(
    e => {
      e.preventDefault()
      track()
      setOverlay({
        isOpen: true,
        template: 'multiUpload',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          model: model,
          action: 'add',
        },
      })
    },
    [model, setOverlay]
  )

  const handleEdit = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Edit Model')
      setOverlay({
        isOpen: true,
        template: 'editModel',
        data: {
          model,
          type: 'model',
          animateIn: true,
          windowed: true,
        },
      })
    },
    [model, setOverlay]
  )

  const handleDownloadModel = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Download Model')
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        id: model.id,
        onFinish: downloadUrl => {
          window.location.assign(downloadUrl)
        },
      })
    },
    [dispatch, model]
  )

  const handleStar = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Star Model')
      dispatch(types.LIKE_MODEL, {
        id: model.id,
        model,
        currentUserId,
        owner: model.owner,
      })
    },
    [currentUserId, dispatch, model]
  )

  const handleRemoveFile = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - Delete Model')
      setOverlay({
        isOpen: true,
        template: 'deleteModel',
        data: {
          model,
          type: 'model',
          animateIn: true,
          windowed: true,
          dialogue: true,
        },
      })
    },
    [model, setOverlay]
  )

  const handleOpenNewTab = useCallback(
    e => {
      e.preventDefault()
      const modelPath = model.identifier ? `/${model.identifier}` : `/model/${model.id}`
      window.open(modelPath, '_blank')
    },
    [model]
  )

  return (
    <div className={c.SubpartMenu}>
      <Spacer size={'1rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleNewVersion}>
        <div>
          <Spacer size={'1.5rem'} />
          <UploadIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Upload New Version</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleNewPart}>
        <div>
          <Spacer size={'1.5rem'} />
          <UploadIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Upload New Part</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleNewVersion}>
        <div>
          <Spacer size={'1.5rem'} />
          <ShareIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Share</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleOpenNewTab}>
        <div>
          <Spacer size={'1.5rem'} />
          <OpenIcon className={c.SubpartMenu_OpenIcon} />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Move to</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleOpenNewTab}>
        <div>
          <Spacer size={'1.5rem'} />
          <OpenIcon className={c.SubpartMenu_OpenIcon} />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Go to Model Page</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleStar}>
        <div>
          <Spacer size={'1.5rem'} />
          <StarIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Add to starred</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleEdit}>
        <div>
          <Spacer size={'1.5rem'} />
          <EditIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Edit</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.SubpartMenu_Item} onClick={handleDownloadModel}>
        <div>
          <Spacer size={'1.5rem'} />
          <DownloadIcon />
          <Spacer size={'.5rem'} />
          <SingleLineBodyText>Download</SingleLineBodyText>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      {hasDeletePermission && (
        <>
          <Divider spacing={'.5rem'} />
          <MenuItem className={c.SubpartMenu_Item} onClick={handleRemoveFile}>
            <div>
              <Spacer size={'1.5rem'} />
              <DeleteIcon />
              <Spacer size={'.5rem'} />
              <SingleLineBodyText>Delete</SingleLineBodyText>
              <Spacer size={'1.5rem'} />
            </div>
          </MenuItem>
        </>
      )}
      <Spacer size={'1rem'} />
    </div>
  )
}

export default SubpartMenu
