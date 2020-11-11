import React, { useCallback } from 'react'
import Skeleton from '@material-ui/lab/Skeleton'
import { Button, Spacer } from '@components'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(_theme => {
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
    ToggleFollowButton: {
      paddingTop: '.75rem',
      paddingBottom: '.75rem',
    },
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
  isFollowing = false,
  dispatch,
}) => {
  const isModelOfCurrentUser = (currentUser && currentUser.id) === profileUserId
  const handleClick = useCallback(
    e => {
      e.preventDefault()
      if (isFollowing) {
        onActionStarted()
        dispatch(types.UNFOLLOW_USER, { id: profileUserId, onFinish: onActionFinished })
        track('Unfollow User', { userId: profileUserId })
      } else {
        onActionStarted()
        dispatch(types.FOLLOW_USER, { id: profileUserId, onFinish: onActionFinished })
        track('Follow User', { userId: profileUserId })
      }
    },
    [dispatch, profileUserId, isFollowing, onActionFinished, onActionStarted]
  )

  return !isModelOfCurrentUser ? (
    !profileUserId ? (
      <Skeleton variant='rect' className={c.ToggleFollowButton_Skeleton} />
    ) : (
      <Button
        className={classnames(className, c.ToggleFollowButton)}
        disabled={isLoading || isError}
        onClick={handleClick}
        secondary
      >
        {isError ? (
          <ErrorIcon className={c.ErrorIcon} />
        ) : (
          <PlusIcon
            className={classnames(c.ToggleFollowButton_icon, {
              [c.ToggleFollowButton_icon__unfollow]: isFollowing,
            })}
          />
        )}
        <Spacer size='.5rem' />
        {isFollowing ? 'Unfollow' : 'Follow'}
      </Button>
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
    <Button
      className={classnames(className, c.ToggleFollowButton)}
      onClick={handleClick}
      secondary
    >
      <div>
        <PlusIcon />
      </div>
      <Spacer size='.5rem' />
      Follow
    </Button>
  )
}

const ToggleFollowButton = ({
  className,
  profileUserId,
  currentUser,
  isFollowing,
  onActionStarted = noop,
  onActionFinished = noop,
  openSignupOverlay = noop,
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
        profileUserId={profileUserId}
        isFollowing={isFollowing}
        onActionFinished={onActionFinished}
        onActionStarted={onActionStarted}
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
