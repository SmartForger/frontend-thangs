import React from 'react'
import * as R from 'ramda'
import { Button } from '@components'
import * as GraphqlService from '@services/graphql-service'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    Likes: {},
    Likes_container: {
      display: 'flex',
      flexFlow: 'column nowrap',
      width: '100%',
      alignItems: 'center',
    },
    Likes_button: {
      maxWidth: '100%',
    },
  }
})

const graphqlService = GraphqlService.getInstance()

const LikesCount = ({ likes }) => {
  const amount = likes.filter(fields => fields.isLiked).length
  return <div>Likes: {amount}</div>
}

const userIdsWhoHaveLiked = R.pipe(
  R.prop('likes'),
  R.filter(R.propEq('isLiked', true)),
  R.map(R.path(['ownerId']))
)

const hasLikedModel = (model, user) => {
  return R.includes(parseInt(user.id), userIdsWhoHaveLiked(model))
}

const LikeButton = ({ model, user }) => {
  const [likeModel] = graphqlService.useLikeModelMutation(user.id, model.id)
  return <Button onClick={likeModel}>Like</Button>
}

const DisabledLikeButton = () => {
  return <Button disabled>Like</Button>
}

const UnlikeButton = ({ model, user }) => {
  const [unlikeModel] = graphqlService.useUnlikeModelMutation(user.id, model.id)
  return <Button onClick={unlikeModel}>Unlike</Button>
}

const ButtonForLikes = ({ model, user }) => {
  if (!user) {
    return <DisabledLikeButton />
  } else if (hasLikedModel(model, user)) {
    return <UnlikeButton model={model} user={user} />
  }
  return <LikeButton model={model} user={user} />
}

const Likes = ({ model, user }) => {
  const c = useStyles()
  return (
    <div className={c.Likes_container}>
      <LikesCount likes={model.likes} />
      <ButtonForLikes className={c.Likes_button} model={model} user={user} />
    </div>
  )
}

export default Likes
