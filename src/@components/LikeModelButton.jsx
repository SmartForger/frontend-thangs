import React from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import * as GraphqlService from '@services/graphql-service'
import { Button } from '@components'

const graphqlService = GraphqlService.getInstance()

const userIdsWhoHaveLiked = R.pipe(R.prop('likes'), R.map(R.path(['owner', 'id'])))

const hasLikedModel = (model, user) => {
  return R.includes(`${user.id}`, userIdsWhoHaveLiked(model))
}

const LikeModelButton = ({ currentUser, modelId }) => {
  const { loading, error, model } = graphqlService.useModelById(modelId)
  const [likeModel] = graphqlService.useLikeModelMutation(currentUser.id, modelId)
  const [unlikeModel] = graphqlService.useUnlikeModelMutation(currentUser.id, modelId)

  if (loading || error) {
    return <div>Loading...</div>
  }

  return hasLikedModel(model, currentUser) ? (
    <Button disabled={loading} onClick={unlikeModel}>
      <HeartFilledIcon /> Liked!
    </Button>
  ) : (
    <Button secondary disabled={loading} onClick={likeModel}>
      <HeartFilledIcon /> Like
    </Button>
  )
}

export default LikeModelButton
