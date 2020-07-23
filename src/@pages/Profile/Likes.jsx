import React from 'react'
import * as R from 'ramda'

import { WithNewThemeLayout } from '@style'
import { useCurrentUser } from '@customHooks/Users'
import { Spinner } from '@components/Spinner'
import { Message404 } from '../404'
import CardCollection from '@components/CardCollection'
import { subheaderText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Likes: {},
    Likes_LikedModelsHeader: {
      ...subheaderText,
      marginBottom: '2rem',
    },
  }
})

const getLikedModels = R.pathOr([], ['likedModels'])

const LikesCount = ({ user }) => {
  const c = useStyles()
  const likes = getLikedModels(user)
  const amount = likes.length

  return <div className={c.Likes_LikedModelsHeader}>Liked Models {amount}</div>
}

const LikesContent = ({ user }) => {
  const models = getLikedModels(user)
  return (
    <CardCollection models={models} noResultsText='You have not liked any models yet.' />
  )
}

const Page = () => {
  const { user, loading, error } = useCurrentUser()
  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (!user) {
    return (
      <div data-cy='fetch-profile-error'>
        <Message404 />
      </div>
    )
  }
  return (
    <>
      <LikesCount user={user} />
      <LikesContent user={user} />
    </>
  )
}

export const Likes = WithNewThemeLayout(Page)
