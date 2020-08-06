import React from 'react'
import * as R from 'ramda'

import { NewThemeLayout } from '@components/Layout'
import { useCurrentUser } from '@customHooks/Users'
import { Spinner } from '@components/Spinner'
import { Message404 } from '../404'
import CardCollection from '@components/CardCollection'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Likes: {},
    Likes_LikedModelsHeader: {
      ...theme.mixins.text.subheaderText,
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
    <CardCollection models={models} noResultsText='You have not liked any models yet.' >
      <ModelCards models={models}/>
    </CardCollection>
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

export const Likes = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}
