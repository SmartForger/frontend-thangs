import React from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { Button } from '@components'
import { createUseStyles } from '@style'
import useServices from '../@hooks/useServices'

const useStyles = createUseStyles(_theme => {
  return {
    LikeModelButton: {
      marginTop: '2rem',
      marginBottom: '1.5rem',
      maxWidth: '7.75rem',
      padding: '.5rem 1.5rem',
    },
  }
})

const hasLikedModel = (modelData, currentUserId) => {
  return R.includes(currentUserId, modelData.likes)
}

const LikeModelButton = ({ currentUser, modelId }) => {
  const c = useStyles()
  const currentUserId = parseInt(currentUser.id)
  const { useFetchOnce } = useServices()
  const {
    atom: { data: modelData, isLoading, isError }, dispatch
  } = useFetchOnce(modelId, 'model')

  const likeModel = () => dispatch('post-like-model', {modelId: modelId, currentUserId: currentUserId})
  const unlikeModel = () => dispatch('delete-like-model', {modelId: modelId, currentUserId: currentUserId})

  if (isLoading || isError) {
    return <div>Loading...</div>
  }

  return hasLikedModel(modelData, currentUserId) ? (
    <Button className={c.LikeModelButton} disabled={isLoading} onClick={unlikeModel}>
      <HeartFilledIcon /> Liked!
    </Button>
  ) : (
    <Button className={c.LikeModelButton} secondary disabled={isLoading} onClick={likeModel}>
      <HeartFilledIcon /> Like
    </Button>
  )
}

export default LikeModelButton
