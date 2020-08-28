import React, { useCallback } from 'react'
import { Button, Spinner } from '@components'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { createUseStyles } from '@style'
import useFetchPerMount from '@hooks/useServices/useFetchPerMount'
import { useStoreon } from 'storeon/react'

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
    Button: {
      marginTop: '1rem',
      width: '6.25rem',
    },
  }
})

const ToggleFollowButton = ({ userId }) => {
  const {
    atom: { isLoading, isError, data: user },
  } = useFetchPerMount(userId, 'user')

  const { dispatch } = useStoreon()

  const c = useStyles()
  const isFollowing = user && user.isBeingFollowedByRequester

  const handleClick = useCallback(e => {
    e.preventDefault()
    if (isFollowing) {
      dispatch('unfollow-user', { id: userId })
    } else {
      dispatch('follow-user', { id: userId })
    }
  }, [dispatch, userId, isFollowing])

  return (
    <Button className={c.Button} disabled={isLoading || isError} onClick={handleClick}>
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
}

export default ToggleFollowButton
