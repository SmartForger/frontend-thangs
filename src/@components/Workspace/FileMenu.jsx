import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { MenuItem } from 'react-contextmenu'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Body } from '@physna/voxel-ui/@atoms/Typography'

import { Divider, Spacer } from '@components'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as OpenIcon } from '@svg/external-link.svg'
import { ReactComponent as ShareIcon } from '@svg/icon-sharedfolder.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload-black.svg'

const useStyles = createUseStyles(theme => {
  return {
    FileMenu: {
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
    FileMenu_OpenIcon: {
      marginLeft: '-4px',
      transform: 'translateX(2px)',

      '& path': {
        fill: '#000',
      },
    },
  }
})

const FileMenu = ({ model = {} }) => {
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
  // const { isAssembly } = model

  const handleNewVersion = useCallback(
    e => {
      e.preventDefault()
      track('File Menu - New Verison')
      setOverlay({
        isOpen: true,
        template: 'multiUpload',
        data: {
          animateIn: true,
          windowed: true,
          dialogue: true,
          versionData: {
            modelId: model.id,
          },
          action: 'update',
        },
      })
    },
    [model, setOverlay]
  )

  // const handleNewPart = useCallback(
  //   e => {
  //     e.preventDefault()
  //     track('File Menu - Add Part')
  //     setOverlay({
  //       isOpen: true,
  //       template: 'multiUpload',
  //       data: {
  //         animateIn: true,
  //         windowed: true,
  //         dialogue: true,
  //         model,
  //         action: 'add',
  //       },
  //     })
  //   },
  //   [model, setOverlay]
  // )

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

  const handleDeleteFile = useCallback(
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

  const handleGoToModel = useCallback(
    e => {
      e.preventDefault()
      const modelPath = model.identifier ? `/${model.identifier}` : `/model/${model.id}`
      window.open(modelPath, '_blank')
    },
    [model]
  )

  const handleMoveTo = useCallback(e => {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log('Open an overlay')
  }, [])

  const handleShare = useCallback(e => {
    e.preventDefault()
    // eslint-disable-next-line no-console
    console.log('Open an overlay')
  }, [])

  return (
    <div className={c.FileMenu}>
      <Spacer size={'1rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleNewVersion}>
        <div>
          <Spacer size={'1.5rem'} />
          <UploadIcon />
          <Spacer size={'.5rem'} />
          <Body>Upload new version</Body>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      {/* {!isAssembly && (
        <MenuItem className={c.FileMenu_Item} onClick={handleNewPart}>
          <div>
            <Spacer size={'1.5rem'} />
            <UploadIcon />
            <Spacer size={'.5rem'} />
            <Body>Add new part</Body>
            <Spacer size={'1.5rem'} />
          </div>
        </MenuItem>
      )} */}
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleShare}>
        <div>
          <Spacer size={'1.5rem'} />
          <ShareIcon />
          <Spacer size={'.5rem'} />
          <Body>Invite</Body>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleMoveTo}>
        <div>
          <Spacer size={'1.5rem'} />
          <OpenIcon className={c.FileMenu_OpenIcon} />
          <Spacer size={'.5rem'} />
          <Body>Move to</Body>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleGoToModel}>
        <div>
          <Spacer size={'1.5rem'} />
          <OpenIcon className={c.FileMenu_OpenIcon} />
          <Spacer size={'.5rem'} />
          <Body>Go to model page</Body>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleStar}>
        <div>
          <Spacer size={'1.5rem'} />
          <StarIcon />
          <Spacer size={'.5rem'} />
          <Body>Add to starred</Body>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleEdit}>
        <div>
          <Spacer size={'1.5rem'} />
          <EditIcon />
          <Spacer size={'.5rem'} />
          <Body>Edit</Body>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      <MenuItem className={c.FileMenu_Item} onClick={handleDownloadModel}>
        <div>
          <Spacer size={'1.5rem'} />
          <DownloadIcon />
          <Spacer size={'.5rem'} />
          <Body>Download</Body>
          <Spacer size={'1.5rem'} />
        </div>
      </MenuItem>
      <Spacer size={'.5rem'} />
      {hasDeletePermission && (
        <>
          <Divider spacing={'.5rem'} />
          <MenuItem className={c.FileMenu_Item} onClick={handleDeleteFile}>
            <div>
              <Spacer size={'1.5rem'} />
              <DeleteIcon />
              <Spacer size={'.5rem'} />
              <Body>Delete</Body>
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
