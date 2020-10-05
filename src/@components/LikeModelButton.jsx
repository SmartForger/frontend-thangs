import React, { useCallback, useState } from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { Button, Spacer } from '@components'
import { createUseStyles } from '@style'
import useServices from '@hooks/useServices'
import * as types from '@constants/storeEventTypes'
import classnames from 'classnames'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    '@keyframes spinner': {
      from: {
        '-moz-transform': 'rotateY(0deg)',
        '-ms-transform': 'rotateY(0deg)',
        transform: 'rotateY(0deg)',
      },
      to: {
        '-moz-transform': 'rotateY(-180deg)',
        '-ms-transform': 'rotateY(-180deg)',
        transform: 'rotateY(-180deg)',
      },
    },
    LikeModelButton: {},
    LikeModelIcon: {
      '& path': {
        fill: theme.colors.black[500],
      },
    },
    LikeModelIcon__liked: {
      animation: '$spinner 250ms linear 0s 1',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    LikeModelIcon__unliked: {
      animation: '$spinner 250ms linear 0s 1 reverse',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
  }
})

const hasLikedModel = (modelData, currentUserId) => {
  return R.includes(currentUserId, modelData.likes)
}

const AuthLikeModelButton = ({ c, currentUser, modelId, userId }) => {
  const currentUserId = parseInt(currentUser.id)
  const isModelOfCurrentUser = (currentUser && currentUser.id) === userId
  const { useFetchOnce } = useServices()
  const {
    atom: { data: modelData, isLoading, isError },
    dispatch,
  } = useFetchOnce(modelId, 'model')
  const [liked, setLiked] = useState(hasLikedModel(modelData, currentUserId))
  const [hasChanged, setHasChanged] = useState(false)
  const handleLikeClicked = useCallback(() => {
    const likeModel = () =>
      dispatch(types.LIKE_MODEL, { modelId: modelId, currentUserId: currentUserId })

    const unlikeModel = () =>
      dispatch(types.UNLIKE_MODEL, { modelId: modelId, currentUserId: currentUserId })

    if (liked) {
      unlikeModel()
      setLiked(false)
      setHasChanged(true)
    } else {
      likeModel()
      setLiked(true)
      setHasChanged(true)
    }
  }, [currentUserId, dispatch, liked, modelId])
  return (
    !isModelOfCurrentUser && (
      <Button
        className={classnames(c.LikeModelButton)}
        secondary
        disabled={isLoading || isError}
        onClick={handleLikeClicked}
      >
        <div>
          {liked ? (
            <HeartFilledIcon
              className={classnames(c.LikeModelIcon, {
                [c.LikeModelIcon__liked]: hasChanged,
              })}
            />
          ) : (
            <HeartIcon
              className={classnames(c.LikeModelIcon, {
                [c.LikeModelIcon__unliked]: hasChanged,
              })}
            />
          )}
        </div>
        <Spacer size='.5rem' />
        {liked ? 'Liked' : 'Like'}
      </Button>
    )
  )
}
const noop = () => null
const UnauthLikeModelButton = ({ c, openSignupOverlay = noop }) => {
  const handleClick = useCallback(() => {
    openSignupOverlay('Join to Like, Follow, Share.', 'Like')
    track('SignUp Prompt Overlay', { source: 'Like' })
  }, [openSignupOverlay])

  return (
    <Button className={classnames(c.LikeModelButton)} onClick={handleClick} secondary>
      <HeartFilledIcon className={c.LikeModelIcon} />
      <Spacer size='.5rem' />
      Like
    </Button>
  )
}

const LikeModelButton = ({
  currentUser,
  modelId,
  profileUserId,
  openSignupOverlay = noop,
}) => {
  const c = useStyles()
  if (currentUser) {
    return (
      <AuthLikeModelButton
        c={c}
        currentUser={currentUser}
        modelId={modelId}
        profileUserId={profileUserId}
      />
    )
  }
  return <UnauthLikeModelButton c={c} openSignupOverlay={openSignupOverlay} />
}

export default LikeModelButton
