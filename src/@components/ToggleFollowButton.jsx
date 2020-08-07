import React, { useCallback } from 'react'
import { Button, Spinner } from '@components'
import { ReactComponent as ErrorIcon } from '@svg/error-triangle.svg'
import * as GraphqlService from '@services/graphql-service'
import { createUseStyles } from '@style'

const graphqlService = GraphqlService.getInstance()

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
  const [followUser, { loading, error }] = graphqlService.useFollowUserMutation(
    viewedUser
  )
  const c = useStyles()
  const handleClick = useCallback(
    e => {
      e.preventDefault()
      followUser()
    },
    [followUser]
  )

  return (
    <Button className={c.Button} disabled={loading || error} onClick={handleClick}>
      {loading ? (
        <Spinner className={c.Spinner} />
      ) : error ? (
        <ErrorIcon className={c.ErrorIcon} />
      ) : (
        'Follow'
      )}
    </Button>
  )
}

const UnfollowButton = ({ _user, viewedUser }) => {
  const [unfollowUser, { loading, error }] = graphqlService.useUnfollowUserMutation(
    viewedUser
  )
  const c = useStyles()
  const handleClick = useCallback(
    e => {
      e.preventDefault()
      unfollowUser()
    },
    [unfollowUser]
  )

  return (
    <Button className={c.Button} disabled={loading || error} onClick={handleClick}>
      {loading ? (
        <Spinner className={c.Spinner} />
      ) : error ? (
        <ErrorIcon className={c.ErrorIcon} />
      ) : (
        'Unfollow'
      )}
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
