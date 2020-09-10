import React from 'react'
import { useServices, useCurrentUserId } from '@hooks'
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

const LikesCount = ({ likedModels, c }) => {
  const amount = likedModels && likedModels.length
  if (amount) {
    return <h1 className={c.Likes_LikedModelsHeader}>Liked Models {amount}</h1>
  }
  return null
}

const LikesContent = ({ likedModels }) => {
  return (
    <CardCollection noResultsText='You have not liked any models yet.'>
      <ModelCards items={likedModels} />
    </CardCollection>
  )
}

const Page = () => {
  const { useFetchPerMount } = useServices()
  const { atom: likedUserModelsAtom } = useFetchPerMount(
    useCurrentUserId(),
    'user-liked-models'
  )

  const c = useStyles()
  if (likedUserModelsAtom.isLoading) {
    return <Spinner />
  }

  if (likedUserModelsAtom.isError) {
    return (
      <div data-cy='fetch-profile-error'>
        Error! We were not able to load this profile. Please try again later.
      </div>
    )
  }

  if (!likedUserModelsAtom.data) {
    return (
      <div data-cy='fetch-profile-error'>
        <Message404 />
      </div>
    )
  }
  return (
    <div className={c.Likes}>
      <LikesCount likedModels={likedUserModelsAtom.data} c={c} />
      <LikesContent likedModels={likedUserModelsAtom.data} />
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
