import React from 'react'
import {useServices} from '@hooks'
import { Spinner, CardCollection, Layout } from '@components'
import { Message404 } from '../404'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'
import useCurrentUserId from '../../@hooks/useCurrentUserId'

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
  const amount = likedModels && likedModels.data && likedModels.data.length
  return <div className={c.Likes_LikedModelsHeader}>Liked Models {amount}</div>
}

const LikesContent = ({ likedModels }) => {
  return (
    <CardCollection noResultsText='You have not liked any models yet.'>
      <ModelCards items={likedModels.data} likes={true} />
    </CardCollection>
  )
}

const Page = () => {
  const { useFetchPerMount } = useServices()
  const { atom: likedUserModelsAtom } = useFetchPerMount(useCurrentUserId(), 'user-liked-models')

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
