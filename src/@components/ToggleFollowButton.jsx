import React, { useCallback } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Pill, Spacer } from '@components'
import { ReactComponent as FollowIcon } from '@svg/icon-follow.svg'
import { ReactComponent as UnfollowIcon } from '@svg/icon-unfollow.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    Spinner: {
      width: '1rem',
      height: '1rem',
      '& .path': {
        stroke: 'currentColor',
      },
    },
    ErrorIcon: {
      width: '1rem',
      height: '1rem',
    },
    ToggleFollowButton: {},
    ToggleFollowButton_icon: {
      transition: 'all 450ms',
    },
    ToggleFollowButton_icon__unfollow: {
      transform: 'rotate(45deg)',
    },
    ToggleFollowButton_Skeleton: {
      paddingBottom: 0,
      margin: 'auto',
      height: '2.5rem !important',
      width: '6.7rem',
      borderRadius: '.5rem',
    },
    ToggleFollowButton__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
  }
})

const AuthFollowButton = ({
  c,
  className,
  currentUser,
  isLoading,
  isError,
  profileUserId,
  onActionFinished = noop,
  onActionStarted = noop,
  onActionFailured = noop,
  isFollowing = false,
  dispatch,
}) => {
  const isModelOfCurrentUser = (currentUser && currentUser.id) === profileUserId
  const handleClick = useCallback(
    e => {
      e.preventDefault()
      if (isFollowing) {
        onActionStarted()
        dispatch(types.UNFOLLOW_USER, {
          id: profileUserId,
          onError: onActionFailured,
          onFinish: onActionFinished,
        })
        track('Unfollow User', { userId: profileUserId })
      } else {
        onActionStarted()
        dispatch(types.FOLLOW_USER, {
          id: profileUserId,
          onError: onActionFailured,
          onFinish: onActionFinished,
        })
        track('Follow User', { userId: profileUserId })
      }
    },
    [
      dispatch,
      profileUserId,
      isFollowing,
      onActionFinished,
      onActionFailured,
      onActionStarted,
    ]
  )

  return !isModelOfCurrentUser ? (
    !profileUserId ? (
      <Skeleton variant='rect' className={c.ToggleFollowButton_Skeleton} />
    ) : (
      <Pill
        className={classnames(className, c.ToggleFollowButton)}
        disabled={isLoading || isError}
        onClick={handleClick}
      >
        {isFollowing ? (
          <UnfollowIcon className={c.ToggleFollowButton_icon} />
        ) : (
          <FollowIcon className={c.ToggleFollowButton_icon} />
        )}
        <div className={c.ToggleFollowButton__desktop}>
          <Spacer size='.5rem' />
          {isFollowing ? 'Unfollow' : 'Follow'}
        </div>
      </Pill>
    )
  ) : null
}
const noop = () => null
const UnauthFollowButton = ({ c, className, openSignupOverlay = noop }) => {
  const handleClick = useCallback(() => {
    openSignupOverlay('Join to Like, Follow, Share.', 'Follow')
    track('SignUp Prompt Overlay', { source: 'Follow' })
  }, [openSignupOverlay])

  return (
    <Pill className={classnames(className, c.ToggleFollowButton)} onClick={handleClick}>
      <div>
        <FollowIcon />
      </div>
      <div className={c.ToggleFollowButton__desktop}>
        <Spacer size='.5rem' />
        Follow
      </div>
    </Pill>
  )
}

const ToggleFollowButton = ({
  className,
  currentUser,
  openSignupOverlay = noop,
  ...props
}) => {
  const { dispatch } = useStoreon()
  const c = useStyles()
  if (currentUser) {
    return (
      <AuthFollowButton
        c={c}
        currentUser={currentUser}
        className={className}
        dispatch={dispatch}
        {...props}
      />
    )
  }
  return (
    <UnauthFollowButton
      c={c}
      className={className}
      openSignupOverlay={openSignupOverlay}
    />
  )
}

export default ToggleFollowButton
