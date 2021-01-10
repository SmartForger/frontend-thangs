import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { Divider, SingleLineBodyText, Spacer } from '@components'
import { createUseStyles } from '@style'
import { MenuItem } from 'react-contextmenu'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

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

const FileMenu = ({ model }) => {
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
      <>
        <MenuItem className={c.FileMenu_Item} onClick={handleDownloadModel}>
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
      <MenuItem className={c.FileMenu_Item} onClick={handleStar}>
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
          <MenuItem className={c.FileMenu_Item} onClick={handleRemoveFile}>
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
