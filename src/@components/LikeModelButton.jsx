import React, { useCallback, useState } from 'react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { Button } from '@components'
import { createUseStyles } from '@style'
import useServices from '@hooks/useServices'
import * as types from '@constants/storeEventTypes'
import classnames from 'classnames'

const useStyles = createUseStyles(_theme => {
  return {
    '@-webkit-keyframes spinner': {
      from: { '-webkit-transform': 'rotateY(0deg)' },
      to: { '-webkit-transform': 'rotateY(-180deg)' },
    },
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
    LikeModelButton: {
      padding: '.5rem 1.25rem',
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

const LikeModelButton = ({ currentUser, modelId }) => {
  const c = useStyles()
  const currentUserId = parseInt(currentUser.id)
  const { useFetchOnce } = useServices()
  const {
    atom: { data: modelData, isLoading, isError },
    dispatch,
  } = useFetchOnce(modelId, 'model')
  const [status, setStatus] = useState(undefined)

  const handleLikeClicked = useCallback(() => {
    const likeModel = () =>
      dispatch(types.LIKE_MODEL, { modelId: modelId, currentUserId: currentUserId })

    const unlikeModel = () =>
      dispatch(types.UNLIKE_MODEL, { modelId: modelId, currentUserId: currentUserId })

    if (hasLikedModel(modelData, currentUserId)) {
      unlikeModel()
      setStatus('liked')
    } else {
      likeModel()
      setStatus('unliked')
    }

    setTimeout(() => {
      setStatus(undefined)
    }, 250)
  }, [currentUserId, dispatch, modelData, modelId])
  return (
    <Button
      className={classnames(c.LikeModelButton)}
      secondary={!hasLikedModel(modelData, currentUserId)}
      disabled={isLoading || isError}
      onClick={handleLikeClicked}
      icon
    >
      <HeartFilledIcon
        className={classnames({
          [c.LikeModelIcon__liked]: status === 'liked',
          [c.LikeModelIcon__unliked]: status === 'unliked',
        })}
      />
    </Button>
  )
}

export default LikeModelButton
