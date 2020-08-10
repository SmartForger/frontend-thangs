import React from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import * as GraphqlService from '@services/graphql-service'
import { Button } from '@components'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    LikeModelButton: {
      marginTop: '2rem',
      marginBottom: '1.5rem',
      maxWidth: '7.75rem',
      padding: '.5rem 1.5rem',

      '& > svg': {
        marginRight: '.5rem',
      },
    },
  }
})

const graphqlService = GraphqlService.getInstance()

const userIdsWhoHaveLiked = R.pipe(
  R.prop('likes'),
  R.filter(R.propEq('isLiked', true)),
  R.map(R.path(['ownerId']))
)

const hasLikedModel = (model, user) => {
  return R.includes(parseInt(user.id), userIdsWhoHaveLiked(model))
}

const LikeModelButton = ({ currentUser, model }) => {
  const c = useStyles()
  const [likeModel] = graphqlService.useLikeModelMutation(currentUser.id, model.id)
  const [unlikeModel] = graphqlService.useUnlikeModelMutation(currentUser.id, model.id)
  return hasLikedModel(model, currentUser) ? (
    <Button dark className={c.LikeModelButton} onClick={unlikeModel}>
      <HeartFilledIcon /> Liked!
    </Button>
  ) : (
    <Button secondary className={c.LikeModelButton} onClick={likeModel}>
      <HeartIcon /> Like
    </Button>
  )
}

export default LikeModelButton
