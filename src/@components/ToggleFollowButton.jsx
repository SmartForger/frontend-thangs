import React, { useCallback } from 'react'
import { Button, Spinner } from '@components'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { createUseStyles } from '@style'
import { useStoreon } from 'storeon/react'
import useFetchOnce from '@hooks/useServices/useFetchOnce'
import * as types from '@constants/storeEventTypes'
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
        secondary={!isFollowing}
        darkText
      >
        {isLoading ? (
          <Spinner className={c.Spinner} />
        ) : isError ? (
          <ErrorIcon className={c.ErrorIcon} />
        ) : isFollowing ? (
          'Unfollow'
        ) : (
          'Follow'
        )}
      </Button>
    )
  )
}
const noop = () => null
const UnauthFollowButton = ({ c, openSignupOverlay = noop }) => {
  const handleClick = useCallback(
    () => openSignupOverlay('Join to Like, Follow, Share.'),
    [openSignupOverlay]
  )

  return (
    <Button className={c.ToggleFollowButton} onClick={handleClick} secondary>
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
