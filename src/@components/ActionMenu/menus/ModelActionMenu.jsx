import React, { useCallback } from 'react'
import { ActionMenu } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as DotStackIcon } from '@svg/dot-stack-icon.svg'
import { ReactComponent as OpenIcon } from '@svg/external-link.svg'
import { ReactComponent as ShareIcon } from '@svg/icon-sharedfolder.svg'
import { useHistory } from 'react-router-dom'
import { track } from '@utilities/analytics'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    ModelActionMenu: {
      width: 'auto',
      color: `${theme.colors.black[500]} !important`,
      right: '-1rem',
      bottom: '4.25rem',
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

const GO_TO_MY_THANGS = 'go-to-my-thangs'
const INVITE = 'invite'



const noop = () => null

const ModelActionTarget = ({ onClick = noop }) => {
  const c = useStyles({})

  return (
    <div className={c.ModelActionMenu_ClickableButton} onClick={onClick}>
      <DotStackIcon />
    </div>
  )
}

const ModelActionMenu = ({ model, onChange = noop }) => {
  const history = useHistory()
  const { setOverlay } = useOverlay()

  const options = [
    {
      label: 'Go to My Thangs',
      Icon: OpenIcon,
      value: GO_TO_MY_THANGS,
    },
    model.folderId && {
      label: 'Invite',
      Icon: ShareIcon,
      value: INVITE,
    },
  ].filter(Boolean)

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
      case GO_TO_MY_THANGS:
        return handleGoToMyThangs()
      case INVITE:
        return handleInviteUsers()
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
      TargetComponent={ModelActionTarget}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ModelActionMenu
