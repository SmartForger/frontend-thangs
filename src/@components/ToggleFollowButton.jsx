import React, { useCallback } from 'react'
import { Button } from '@components'
// import { Button, Spinner } from '@components'
// import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import { createUseStyles } from '@style'

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

const FollowButton = ({ _user, viewedUser }) => {
  const c = useStyles()
  const handleClick = useCallback(
    e => {
      e.preventDefault()
      console.log('This needs changed to REST!', 'followUser()', viewedUser)
    },
    [viewedUser]
  )

  return (
    <Button className={c.Button} onClick={handleClick}>
      {/* {loading ? (
        <Spinner className={c.Spinner} />
      ) : error ? (
        <ErrorIcon className={c.ErrorIcon} />
      ) : ( */}
      Follow
      {/* )} */}
    </Button>
  )
}

const UnfollowButton = ({ _user, viewedUser }) => {
  const c = useStyles()
  const handleClick = useCallback(
    e => {
      e.preventDefault()
      console.log('This needs changed to REST!', 'followUser()', viewedUser)
    },
    [viewedUser]
  )

  return (
    <Button className={c.Button} onClick={handleClick}>
      {/* {loading ? (
        <Spinner className={c.Spinner} />
      ) : error ? (
        <ErrorIcon className={c.ErrorIcon} />
      ) : ( */}
      Unfollow
      {/* )} */}
    </Button>
  )
}

const ToggleFollowButton = ({ viewedUser }) => {
  const isFollowing = viewedUser.isBeingFollowedByRequester
  return isFollowing ? (
    <UnfollowButton viewedUser={viewedUser} />
  ) : (
    <FollowButton viewedUser={viewedUser} />
  )
}

export default ToggleFollowButton
