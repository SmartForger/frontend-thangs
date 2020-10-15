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
    LikeFolderButton: {},
    LikeFolderIcon: {
      '& path': {
        fill: theme.colors.black[500],
      },
    },
    LikeFolderIcon__liked: {
      animation: '$spinner 250ms linear 0s 1',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    LikeFolderIcon__unliked: {
      animation: '$spinner 250ms linear 0s 1 reverse',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
  }
})

const hasLikedFolder = (folderData, currentUserId) => {
  return R.includes(parseInt(currentUserId), folderData.likes)
}

const HeartButton = ({ liked, c, hasChanged }) => {
  return liked ? (
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
  )
}

const StarButton = ({ liked, c, hasChanged }) => {
  return liked ? (
    <StarFilledIcon
      className={classnames(c.LikeModelIcon, {
        [c.LikeModelIcon__liked]: hasChanged,
      })}
    />
  ) : (
    <StarIcon
      className={classnames(c.LikeModelIcon, {
        [c.LikeModelIcon__unliked]: hasChanged,
      })}
    />
  )
}

const LikeFolderButton = ({ className, folder = {}, minimal, onlyShowOwned }) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()
  const currentUserId = authenticationService.getCurrentUserId()
  const { id, creator = {} } = folder
  const isFolderOfCurrentUser = useMemo(
    () => String(currentUserId) === String(creator.id),
    [currentUserId, creator.id]
  )

  const [liked, setLiked] = useState(hasLikedFolder(folder, currentUserId))
  const [hasChanged, setHasChanged] = useState(false)
  const handleLikeClicked = useCallback(
    e => {
      e.stopPropagation()
      const likeFolder = () => dispatch(types.LIKE_FOLDER, { id })
      const unlikeFolder = () => dispatch(types.UNLIKE_FOLDER, { id })
      if (liked) {
        unlikeFolder()
        setLiked(false)
        setHasChanged(true)
      } else {
        likeFolder()
        setLiked(true)
        setHasChanged(true)
      }
    },
    [liked, dispatch, id]
  )

  if (onlyShowOwned && !isFolderOfCurrentUser) return null

  if (minimal) {
    return (
      <div className={className} onClick={handleLikeClicked}>
        {isFolderOfCurrentUser ? (
          <StarButton liked={liked} c={c} hasChanged={hasChanged} />
        ) : (
          <HeartButton liked={liked} c={c} hasChanged={hasChanged} />
        )}
      </div>
    )
  }

  return (
    <Button
      className={classnames(className, c.LikeFolderButton)}
      secondary
      onClick={handleLikeClicked}
    >
      <div>
        {isFolderOfCurrentUser ? (
          <StarButton liked={liked} c={c} hasChanged={hasChanged} />
        ) : (
          <HeartButton liked={liked} c={c} hasChanged={hasChanged} />
        )}
      </div>
      <Spacer size='.5rem' />
    </Button>
  )
}

export default LikeFolderButton
