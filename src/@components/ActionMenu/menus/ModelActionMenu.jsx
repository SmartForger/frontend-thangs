import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { DotStackActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as OpenIcon } from '@svg/external-link.svg'
import { ReactComponent as EditIcon } from '@svg/icon-edit.svg'
import { ReactComponent as ShareIcon } from '@svg/icon-sharedfolder.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import { ReactComponent as DeleteIcon } from '@svg/icon-delete.svg'
import { ReactComponent as UploadIcon } from '@svg/icon-upload-black.svg'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { MODEL_MENU_OPTIONS } from '@constants/menuOptions'
const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    ModelActionMenu: {
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    ModelActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    ModelActionMenu__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    ModelActionMenu__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const ModelActionMenu = ({
  model = {},
  isExpandedOptions = false,
  isStaticBackground = false,
  omitOptions = [],
  onChange = noop,
}) => {
  const history = useHistory()
  const { dispatch } = useStoreon()
  const { setOverlay } = useOverlay()
  const currentUserId = authenticationService.getCurrentUserId()
  const c = useStyles({})

  const options = [
    ...(!isExpandedOptions
      ? [
        {
          label: 'Go to My Thangs',
          Icon: OpenIcon,
          value: MODEL_MENU_OPTIONS.GO_TO_MY_THANGS,
        },
      ]
      : []),
    ...(model.folderId
      ? [
        {
          label: 'Invite',
          Icon: ShareIcon,
          value: MODEL_MENU_OPTIONS.INVITE,
        },
      ]
      : []),
    ...(isExpandedOptions
      ? [
        {
          label: 'Upload new version',
          Icon: UploadIcon,
          value: MODEL_MENU_OPTIONS.NEW_VERSION,
        },
        {
          label: 'Go to model',
          Icon: OpenIcon,
          value: MODEL_MENU_OPTIONS.GO_TO_MODEL,
        },
        {
          label: 'Add to starred',
          Icon: StarIcon,
          value: MODEL_MENU_OPTIONS.ADD_TO_STARRED,
        },
        {
          label: 'Download',
          Icon: DownloadIcon,
          value: MODEL_MENU_OPTIONS.DOWNLOAD,
        },
        {
          label: 'Edit',
          Icon: EditIcon,
          value: MODEL_MENU_OPTIONS.EDIT,
        },
        {
          label: 'Delete',
          Icon: DeleteIcon,
          value: MODEL_MENU_OPTIONS.DELETE,
        },
      ]
      : []),
  ].filter(opt => !omitOptions.includes(opt.value))

  const handleNewVersion = useCallback(() => {
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
          actionType: 'update',
        },
      },
    })
  }, [model, setOverlay])

  const handleEdit = useCallback(() => {
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
  }, [model, setOverlay])

  const handleGoToMyThangs = () => {
    history.push(`/mythangs/file/${model.id}`)
  }

  const handleInviteUsers = useCallback(() => {
    track('Model Action Menu - Invite Members')
    setOverlay({
      isOpen: true,
      template: 'inviteUsers',
      data: {
        folderId: model.folderId,
        animateIn: true,
        windowed: true,
        dialogue: true,
      },
    })
  }, [model.folderId, setOverlay])

  const handleGoToModel = useCallback(() => {
    const modelPath = model.identifier ? `/${model.identifier}` : `/model/${model.id}`
    window.open(modelPath, '_blank')
  }, [model])

  const handleStar = useCallback(() => {
    track('File Menu - Star Model')
    dispatch(types.LIKE_MODEL, {
      id: model.id,
      model,
      currentUserId,
      owner: model.owner,
    })
  }, [currentUserId, dispatch, model])

  const handleDownloadModel = useCallback(() => {
    track('File Menu - Download Model')
    dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
      id: model.id,
      onFinish: downloadUrl => {
        window.location.assign(downloadUrl)
      },
    })
  }, [dispatch, model])

  const handleDeleteFile = useCallback(() => {
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
  }, [model, setOverlay])

  const handleOnChange = value => {
    switch (value) {
      case MODEL_MENU_OPTIONS.GO_TO_MY_THANGS:
        return handleGoToMyThangs()
      case MODEL_MENU_OPTIONS.INVITE:
        return handleInviteUsers()
      case MODEL_MENU_OPTIONS.GO_TO_MODEL:
        return handleGoToModel()
      case MODEL_MENU_OPTIONS.MOVE_MODEL:
        return noop()
      case MODEL_MENU_OPTIONS.ADD_TO_STARRED:
        return handleStar()
      case MODEL_MENU_OPTIONS.DOWNLOAD:
        return handleDownloadModel()
      case MODEL_MENU_OPTIONS.DELETE:
        return handleDeleteFile()
      case MODEL_MENU_OPTIONS.EDIT:
        return handleEdit()
      case MODEL_MENU_OPTIONS.NEW_VERSION:
        return handleNewVersion()
      default:
        return onChange(value)
    }
  }

  return (
    <DotStackActionMenu
      onChange={handleOnChange}
      actionMenuTitle='Select action'
      alignItems='left'
      isStaticBackground={isStaticBackground}
      options={options}
      menuComponentProps={{ className: c.ModelActionMenu }}
    />
  )
}

export default ModelActionMenu
