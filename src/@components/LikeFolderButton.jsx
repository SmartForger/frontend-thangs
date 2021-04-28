import React, { useCallback, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'
import * as R from 'ramda'
import { ReactComponent as StarFilledIcon } from '@svg/icon-star-filled.svg'
import { ReactComponent as StarIcon } from '@svg/icon-star-outline.svg'
import { IconButton } from '@components'
import { createUseStyles } from '@physna/voxel-ui/@style'
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
    LikeFolderIcon: {},
    LikeFolderIcon__liked: {
      animation: '$spinner 250ms linear 0s 1',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    LikeFolderIcon__filled: {
      '& path': {
        fill: ({ color }) => color || theme.colors.black[500],
        stroke: ({ color }) => color || theme.colors.black[500],
      },
    },
    LikeFolderIcon__unliked: {
      animation: '$spinner 250ms linear 0s 1 reverse',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    LikeFolderIcon__unfilled: {
      '& path': {
        fill: 'transparent',
        stroke: ({ color }) => color || theme.colors.black[500],
      },
    },
  }
})

const hasLikedFolder = (folderData, currentUserId) => {
  return R.includes(parseInt(currentUserId), (folderData && folderData.likes) || [])
}

const StarButton = ({ liked, c, hasChanged, onClick }) => {
  return liked ? (
    <IconButton onClick={onClick}>
      <StarFilledIcon
        className={classnames(c.LikeFolderIcon, c.LikeFolderIcon__filled, {
          [c.LikeFolderIcon__liked]: hasChanged,
        })}
      />
    </IconButton>
  ) : (
    <IconButton onClick={onClick}>
      <StarIcon
        className={classnames(c.LikeFolderIcon, c.LikeFolderIcon__unfilled, {
          [c.LikeFolderIcon__unliked]: hasChanged,
        })}
      />
    </IconButton>
  )
}

const StarMinimalButton = ({ liked, c, hasChanged }) => {
  return liked ? (
    <StarFilledIcon
      className={classnames(c.LikeFolderIcon, c.LikeFolderIcon__filled, {
        [c.LikeFolderIcon__liked]: hasChanged,
      })}
    />
  ) : (
    <StarIcon
      className={classnames(c.LikeFolderIcon, c.LikeFolderIcon__unfilled, {
        [c.LikeFolderIcon__unliked]: hasChanged,
      })}
    />
  )
}

const LikeFolderButton = ({ className, color, folder = {}, minimal, onlyShowOwned }) => {
  const { dispatch } = useStoreon()
  const currentUserId = authenticationService.getCurrentUserId()
  const { id, creator = {} } = folder
  const isFolderOfCurrentUser = useMemo(
    () => String(currentUserId) === String(creator.id),
    [currentUserId, creator.id]
  )
  const c = useStyles({ color })

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
        <StarMinimalButton liked={liked} c={c} hasChanged={hasChanged} />
      </div>
    )
  }

  return (
    <StarButton liked={liked} c={c} onClick={handleLikeClicked} hasChanged={hasChanged} />
  )
}

export default LikeFolderButton
