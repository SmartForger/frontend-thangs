import React from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import * as GraphqlService from '@services/graphql-service'
import { SecondaryButton, DarkButton } from '@components/Button'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    LikeModelButton: {
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

const userIdsWhoHaveLiked = R.pipe(R.prop('likes'), R.map(R.path(['owner', 'id'])))

export const hasLikedModel = (model, user) => {
  return R.includes(user.id, userIdsWhoHaveLiked(model))
}

export function LikeModelButton({ currentUser, model }) {
  const c = useStyles()
  const [likeModel] = graphqlService.useLikeModelMutation(currentUser.id, model.id)
  const [unlikeModel] = graphqlService.useUnlikeModelMutation(currentUser.id, model.id)
  return hasLikedModel(model, currentUser) ? (
    <DarkButton className={c.LikeModelButton} onClick={unlikeModel}>
      <HeartFilledIcon /> Liked!
    </DarkButton>
  ) : (
    <SecondaryButton className={c.LikeModelButton} onClick={likeModel}>
      <HeartIcon /> Like
    </SecondaryButton>
  )
}
