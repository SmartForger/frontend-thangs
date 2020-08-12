import React from 'react'
import * as R from 'ramda'
import { useCurrentUser } from '@hooks'
import { Spinner, CardCollection, Layout } from '@components'
import { Message404 } from '../404'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Likes: {
      width: '100%',
    },
    Likes_LikedModelsHeader: {
      ...theme.mixins.text.subheaderText,
      marginBottom: '2rem',
    },
  }
})

const getLikedModels = R.pathOr([], ['likedModels'])

const LikesCount = ({ user, c }) => {
  const likes = getLikedModels(user)
  const amount = likes.length

  return <div className={c.Likes_LikedModelsHeader}>Liked Models {amount}</div>
}

const LikesContent = ({ user }) => {
  const models = getLikedModels(user)
  return (
    <CardCollection models={models} noResultsText='You have not liked any models yet.'>
      <ModelCards models={models} likes={true} />
    </CardCollection>
  )
}

const Page = () => {
  const { user, loading, error } = useCurrentUser()
  const c = useStyles()
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
    <div className={c.Likes}>
      <LikesCount user={user} c={c} />
      <LikesContent user={user} />
    </div>
  )
}

export const Likes = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
