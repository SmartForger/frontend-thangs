import React, { useCallback, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as StarFilledIcon } from '@svg/icon-star-filled.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { Button, Spacer } from '@components'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import classnames from 'classnames'
import { track } from '@utilities/analytics'
import { authenticationService } from '@services'

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
    LikeModelIcon: {},
    LikeModelIcon__liked: {
      animation: '$spinner 250ms linear 0s 1',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    LikeModelIcon__filled: {
      '& path': {
        fill: ({ color }) => color || theme.colors.black[500],
        stroke: ({ color }) => color || theme.colors.black[500],
      },
    },
    LikeModelIcon__unliked: {
      animation: '$spinner 250ms linear 0s 1 reverse',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    LikeModelIcon__unfilled: {
      '& path': {
        fill: ({ color }) => (color ? 'transparent' : theme.colors.black[500]),
        stroke: ({ color }) => color || 'transparent',
      },
    },
  }
})

const noop = () => null

const hasLikedModel = (model, currentUserId) => {
  return R.includes(parseInt(currentUserId), model.likes)
}

const HeartButton = ({ liked, c, hasChanged }) => {
  return liked ? (
    <HeartFilledIcon
      className={classnames(c.LikeModelIcon, c.LikeModelIcon__filled, {
        [c.LikeModelIcon__liked]: hasChanged,
      })}
    />
  ) : (
    <HeartIcon
      className={classnames(c.LikeModelIcon, c.LikeModelIcon__unfilled, {
        [c.LikeModelIcon__unliked]: hasChanged,
      })}
    />
  )
}

const StarButton = ({ liked, c, hasChanged }) => {
  return liked ? (
    <StarFilledIcon
      className={classnames(c.LikeModelIcon, c.LikeModelIcon__filled, {
        [c.LikeModelIcon__liked]: hasChanged,
      })}
    />
  ) : (
    <StarIcon
      className={classnames(c.LikeModelIcon, c.LikeModelIcon__unfilled, {
        [c.LikeModelIcon__unliked]: hasChanged,
      })}
    />
  )
}

const AuthLikeModelButton = ({
  c,
  className,
  currentUserId,
  model = {},
  minimal,
  onlyShowOwned,
}) => {
  const { id, owner = {} } = model
  const isModelOfCurrentUser = useMemo(() => String(currentUserId) === String(owner.id), [
    currentUserId,
    owner.id,
  ])
  const { dispatch } = useStoreon()
  const [liked, setLiked] = useState(hasLikedModel(model, currentUserId))
  const [hasChanged, setHasChanged] = useState(false)
  const handleLikeClicked = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()
      const likeModel = () => dispatch(types.LIKE_MODEL, { id, model, owner })
      const unlikeModel = () => dispatch(types.UNLIKE_MODEL, { id, model, owner })
      if (liked) {
        unlikeModel()
        setLiked(false)
        setHasChanged(true)
      } else {
        likeModel()
        setLiked(true)
        setHasChanged(true)
      }
    },
    [liked, dispatch, id, model, owner]
  )

  if (onlyShowOwned && !isModelOfCurrentUser) return null

  if (minimal) {
    return (
      <div className={className} onClick={handleLikeClicked}>
        {isModelOfCurrentUser ? (
          <StarButton liked={liked} c={c} hasChanged={hasChanged} />
        ) : (
          <HeartButton liked={liked} c={c} hasChanged={hasChanged} />
        )}
      </div>
    )
  }

  return (
    <Button
      className={classnames(className, c.LikeModelButton)}
      secondary
      onClick={handleLikeClicked}
    >
      {isModelOfCurrentUser ? (
        <>
          <StarButton liked={liked} c={c} hasChanged={hasChanged} />
          <Spacer size='.5rem' />
          {liked ? 'Starred' : 'Star'}
        </>
      ) : (
        <>
          <HeartButton liked={liked} c={c} hasChanged={hasChanged} />
          <Spacer size='.5rem' />
          {liked ? 'Liked' : 'Like'}
        </>
      )}
    </Button>
  )
}

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
  className,
  color,
  model,
  openSignupOverlay = noop,
  minimal,
  onlyShowOwned,
}) => {
  const c = useStyles({ color })
  const currentUserId = authenticationService.getCurrentUserId()
  if (currentUserId) {
    return (
      <AuthLikeModelButton
        c={c}
        className={className}
        currentUserId={currentUserId}
        model={model}
        minimal={minimal}
        onlyShowOwned={onlyShowOwned}
      />
    )
  }
  return <UnauthLikeModelButton c={c} openSignupOverlay={openSignupOverlay} />
}

export default LikeModelButton
