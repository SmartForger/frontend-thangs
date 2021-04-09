import React, { useCallback } from 'react'
import { ActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as OpenIcon } from '@svg/external-link.svg'
import { ReactComponent as ShareIcon } from '@svg/icon-sharedfolder.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { ReactComponent as DownloadIcon } from '@svg/icon-download.svg'
import { useHistory } from 'react-router-dom'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'
import { MODEL_MENU_OPTIONS } from '@constants/menuOptions'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    FolderActionMenu: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
      display: 'none',

      [md]: {
        display: 'block',
      },
    },
    FolderActionMenu_ClickableButton: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    FolderActionMenu__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
    FolderActionMenu__mobile: {
      display: 'flex',

      [md]: {
        display: 'none',
      },
    },
  }
})

const noop = () => null

const FolderActionTarget = ({ onClick = noop }) => {
  const c = useStyles({})

  return (
    <div className={c.FolderActionMenu_ClickableButton} onClick={onClick}>
      <DotStackIcon />
    </div>
  )
}

const FolderActionMenu = ({ model = {}, isExpandedOptions = false, omitOptions = [], onChange = noop }) => {
  const history = useHistory()
  const { setOverlay } = useOverlay()

  const options = [
    ...(!isExpandedOptions ? [
      {
        label: 'Go to My Thangs',
        Icon: OpenIcon,
        value: MODEL_MENU_OPTIONS.GO_TO_MY_THANGS,
      },
    ] : []),
    ...(model.folderId ? [
      {
        label: 'Invite',
        Icon: ShareIcon,
        value: MODEL_MENU_OPTIONS.INVITE,
      }
    ] : []),
    ...(isExpandedOptions ? [
      {
        label: 'Go to Model',
        Icon: OpenIcon,
        value: MODEL_MENU_OPTIONS.GO_TO_MODEL,
      },
      {
        label: 'Move to',
        Icon: OpenIcon,
        value: MODEL_MENU_OPTIONS.MOVE_MODEL,
      },
      {
        label: 'Add to Starred',
        Icon: StarIcon,
        value: MODEL_MENU_OPTIONS.ADD_TO_STARRED,
      },
      {
        label: 'Download',
        Icon: DownloadIcon,
        value: MODEL_MENU_OPTIONS.DOWNLOAD,
      },
      {
        label: 'Delete',
        Icon: StarIcon,
        value: MODEL_MENU_OPTIONS.DELETE,
      },
    ] : [])
  ].filter(opt => !omitOptions.includes(opt.value))

  const handleGoToMyThangs = () => {
    history.push(`/mythangs/file/${model.id}`)
  }

  const handleInviteUsers = useCallback(
    () => {
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
    },
    [model.folderId, setOverlay]
  )

  const handleOnChange = (value) => {
    switch (value) {
      case MODEL_MENU_OPTIONS.GO_TO_MY_THANGS:
        return handleGoToMyThangs()
      case MODEL_MENU_OPTIONS.INVITE:
        return handleInviteUsers()
      case MODEL_MENU_OPTIONS.GO_TO_MODEL:
        return noop()
      case MODEL_MENU_OPTIONS.MOVE_MODEL:
        return noop()
      case MODEL_MENU_OPTIONS.ADD_TO_STARRED:
        return noop()
      case MODEL_MENU_OPTIONS.DOWNLOAD:
        return noop()
      case MODEL_MENU_OPTIONS.DELETE:
        return noop()
      default:
        return onChange(value)
    }
  }

  return (
    <ActionMenu
      MenuComponentProps={{
        modelId: model.id,
        onChange: handleOnChange,
        actionBarTitle: 'Select action',
        options,
        tabletLayout: false,
      }}
      TargetComponent={FolderActionTarget}
      isCloseOnSelect={true}
      isMobileOnly={true} // TODO: Fix isMobileOnly. Using this to add spacers between items.
    />
  )
}

export default FolderActionMenu
