import React, { useCallback } from 'react'
import { Button, Spacer } from '@components'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { ReactComponent as PlusIcon } from '@svg/icon-plus.svg'
import { createUseStyles } from '@style'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import useFetchOnce from '@hooks/useServices/useFetchOnce'
import * as pendo from '@vendors/pendo'

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
  }
})

const AuthFollowButton = ({ c, currentUser, profileUserId, dispatch }) => {
  const {
    atom: { isLoading, isError, data: user },
  } = useFetchOnce(profileUserId, 'user')
  const isModelOfCurrentUser = (currentUser && currentUser.id) === profileUserId
  const isFollowing = user && user.isBeingFollowedByRequester

  const handleClick = useCallback(
    e => {
      e.preventDefault()
      if (isFollowing) {
        dispatch('unfollow-user', { id: profileUserId })
        pendo.track('Unfollow User', profileUserId)
      } else {
        dispatch('follow-user', { id: profileUserId })
        pendo.track('Follow User', profileUserId)
      }
    },
    [dispatch, profileUserId, isFollowing]
  )

  return (
    !isModelOfCurrentUser && (
      <Button
        className={c.ToggleFollowButton}
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
  )
}
const noop = () => null
const UnauthFollowButton = ({ c, openSignupOverlay = noop }) => {
  const handleClick = useCallback(() => {
    openSignupOverlay('Join to Like, Follow, Share.')
    pendo.track('SignUp Prompt Overlay', { source: 'Follow' })
  }, [openSignupOverlay])

  return (
    <Button className={c.ToggleFollowButton} onClick={handleClick} secondary>
      <div>
        <PlusIcon />
      </div>
      <Spacer size='.5rem' />
      Follow
    </Button>
  )
}

const ToggleFollowButton = ({ profileUserId, currentUser, openSignupOverlay = noop }) => {
  const { dispatch } = useStoreon()
  const c = useStyles()
  if (currentUser) {
    return (
      <AuthFollowButton
        c={c}
        currentUser={currentUser}
        dispatch={dispatch}
        profileUserId={profileUserId}
      />
    )
  }
  return <UnauthFollowButton c={c} openSignupOverlay={openSignupOverlay} />
}

export default ToggleFollowButton
