import React, { useCallback, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as StarFilledIcon } from '@svg/icon-star-filled.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { Pill, Spacer } from '@components'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'
import classnames from 'classnames'
import { track } from '@utilities/analytics'
import { authenticationService } from '@services'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    LikeIcon: {
      [md]: {
        width: '.75rem',
        height: '.75rem',
      },
    },
    LikeStarIcon__filled: {
      '& path': {
        fill: ({ color }) => color || theme.colors.black[500],
        stroke: ({ color }) => color || theme.colors.black[500],
      },
    },
    LikeHeartIcon__filled: {
      '& path': {
        fill: ({ color }) => color || undefined,
        stroke: ({ color }) => color || undefined,
      },
    },
    LikeStarIcon__unfilled: {
      '& path': {
        fill: ({ color }) => color || 'transparent',
        stroke: ({ color }) => (color ? 'transparent' : theme.colors.black[500]),
      },
    },
    LikeHeartIcon__unfilled: {
      '& path': {
        fill: ({ color }) => (color ? 'transparent' : theme.colors.black[500]),
        stroke: ({ color }) => color || 'transparent',
      },
    },
    LikeModelButton__desktop: {
      display: 'none',

      [md]: {
        display: 'flex',
      },
    },
  }
})

const noop = () => null

const hasLikedModel = (model, currentUser = {}) => {
  const userData = currentUser.data
  if (userData && userData.likes && R.includes(parseInt(model.id), userData.likes))
    return true
  return model.likes ? R.includes(parseInt(currentUser), model.likes) : false
}

const HeartButton = ({ liked, c, hasChanged }) => {
  return liked ? (
    <HeartFilledIcon
      className={classnames(c.LikeIcon, c.LikeHeartIcon__filled, {
        [c.LikeModelIcon__liked]: hasChanged,
      })}
    />
  ) : (
    <HeartIcon
      className={classnames(c.LikeIcon, c.LikeHeartIcon__unfilled, {
        [c.LikeModelIcon__unliked]: hasChanged,
      })}
    />
  )
}

const StarButton = ({ liked, c, hasChanged }) => {
  return liked ? (
    <StarFilledIcon
      className={classnames(c.LikeIcon, c.LikeStarIcon__filled, {
        [c.LikeModelIcon__liked]: hasChanged,
      })}
    />
  ) : (
    <StarIcon
      className={classnames(c.LikeIcon, c.LikeStarIcon__unfilled, {
        [c.LikeModelIcon__unliked]: hasChanged,
      })}
    />
  )
}

const AuthLikeModelButton = ({
  c,
  className,
  currentUserId,
  hideForOwned,
  model = {},
  minimal,
  onlyShowOwned,
}) => {
  const { owner = {} } = model
  const isModelOfCurrentUser = useMemo(() => String(currentUserId) === String(owner.id), [
    currentUserId,
    owner.id,
  ])
  const { dispatch, [`user-${currentUserId}`]: userAtom = {} } = useStoreon(
    `user-${currentUserId}`
  )
  const [liked, setLiked] = useState(hasLikedModel(model, userAtom))
  const [hasChanged, setHasChanged] = useState(false)
  const handleLikeClicked = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()

      if (liked) {
        dispatch(types.UNLIKE_MODEL, { model })
        setLiked(false)
        setHasChanged(true)
      } else {
        dispatch(types.LIKE_MODEL, { model })
        setLiked(true)
        setHasChanged(true)
      }
    },
    [liked, dispatch, model]
  )

  if (onlyShowOwned && !isModelOfCurrentUser) return null
  if (hideForOwned && isModelOfCurrentUser) return null
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
    <Pill className={className} onClick={handleLikeClicked}>
      {isModelOfCurrentUser ? (
        <>
          <StarButton liked={liked} c={c} hasChanged={hasChanged} />
          <div className={c.LikeModelButton__desktop}>
            <Spacer size='.5rem' />
            <span>{liked ? 'Unstar' : 'Star'}</span>
          </div>
        </>
      ) : (
        <>
          <HeartButton liked={liked} c={c} hasChanged={hasChanged} />
          <div className={c.LikeModelButton__desktop}>
            <Spacer size='.5rem' />
            <span>{liked ? 'Liked' : 'Like'}</span>
          </div>
        </>
      )}
    </Pill>
  )
}

const UnauthLikeModelButton = ({ openSignupOverlay = noop }) => {
  const c = useStyles({})

  const handleClick = useCallback(() => {
    openSignupOverlay('Join to Like, Follow, Share.', 'Like')
    track('SignUp Prompt Overlay', { source: 'Like' })
  }, [openSignupOverlay])

  return (
    <Pill onClick={handleClick}>
      <HeartFilledIcon />
      <Spacer size='.5rem' className={c.LikeModelButton__desktop} />
      <span className={c.LikeModelButton__desktop}>Like</span>
    </Pill>
  )
}

const LikeModelButton = ({
  className,
  color,
  model,
  openSignupOverlay = noop,
  minimal,
  onlyShowOwned,
  hideForOwned,
}) => {
  const c = useStyles({ color })
  const currentUserId = authenticationService.getCurrentUserId()
  if (currentUserId) {
    return (
      <AuthLikeModelButton
        c={c}
        className={className}
        currentUserId={currentUserId}
        hideForOwned={hideForOwned}
        model={model}
        minimal={minimal}
        onlyShowOwned={onlyShowOwned}
      />
    )
  }
  return <UnauthLikeModelButton c={c} openSignupOverlay={openSignupOverlay} />
}

export default LikeModelButton
