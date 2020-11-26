import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import * as R from 'ramda'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { ReactComponent as ChatIcon } from '@svg/icon-comment.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import * as types from '@constants/storeEventTypes'
import { ModelThumbnail, UserInline, EditModel } from '@components'
import { createUseStyles } from '@style'
import { useCurrentUserId } from '@hooks'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { xs, sm, md, lg },
  } = theme

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
    ModelCard: {
      position: 'relative',
      backgroundColor: theme.variables.colors.cardBackground,
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '.75rem',
      border: `2px solid ${theme.colors.white[900]}`,
      transition: 'all 100ms',

      '&:hover': {
        transition: 'all 300ms',
        boxShadow: '0px 20px 80px rgba(0, 0, 0, 0.2)',
        zIndex: 1,
      },
    },
    ModelCard_UserLine: {
      margin: '1.125rem',

      [xs]: {
        marginBottom: '1rem',
      },

      [sm]: {
        marginBottom: '1rem',
      },

      [md]: {
        marginBottom: '1.5rem',
      },

      [lg]: {
        marginTop: '1.375rem',
        marginBottom: '2rem',

        '& > div': {
          width: '1.875rem !important',
          height: '1.875rem !important',
          '& > img': {
            width: '1.875rem !important',
            height: '1.875rem !important',
          },
        },
      },
    },
    ModelCard_Thumbnail: {
      margin: 'auto !important',
      padding: '0 !important',
      width: '100%',

      [xs]: {
        height: '146px !important',
      },

      [sm]: {
        height: '146px !important',
      },

      [md]: {
        height: '157px !important',
      },

      [lg]: {
        height: '270px !important',
      },
    },
    ModelCard_Footer: {
      marginLeft: '1.25rem',
      marginBottom: '1.125rem',
      marginRight: '1.25rem',

      '& > *:last-child': {
        marginTop: '.375rem',
      },

      [xs]: {
        marginTop: '1rem',
        width: '7.75rem',
      },

      [sm]: {
        marginTop: '1rem',
        width: '7.75rem',
      },

      [md]: {
        marginTop: '1.5rem',
        width: '11.31rem',
        '& > *:last-child': {
          marginTop: '.375rem',
        },
      },

      [lg]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '2rem',
        marginBottom: '1.375rem',
        width: 'unset',
        '& > *:last-child': {
          marginTop: 0,
        },
      },
    },
    ModelCard_Name: {
      fontWeight: 500,
      fontSize: '.875rem',
      color: theme.colors.black[100],

      whiteSpace: 'nowrap',
      lineHeight: '1rem !important',
      textOverflow: 'ellipsis',
      overflow: 'hidden',

      [xs]: {
        maxWidth: '7.75rem',
      },

      [sm]: {
        maxWidth: '7.75rem',
      },

      [md]: {
        maxWidth: '11.31rem',
      },

      [lg]: {
        maxWidth: 'unset',
      },
    },

    ModelCard_LikesAndComments: {
      display: 'flex',
      flexDirection: 'row',

      '& > span:not(:last-child)': {
        marginRight: '1rem',
      },
    },
    ModelCard_ActivityCount: {
      ...theme.text.thumbnailActivityCountText,

      '& svg, & path': {
        fill: theme.colors.purple[900],
      },

      '& > *': {
        marginRight: '.25rem',
      },

      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,
    },
    ModelCard_Icon__liked: {
      animation: '$spinner 250ms linear 0s 1',

      '-webkit-transform-style': 'preserve-3d',
      '-moz-transform-style': 'preserve-3d',
      '-ms-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d',
    },
    ModelCard_EditModel: {
      position: 'absolute',
      right: '1rem',
      top: '1rem',
    },
  }
})

const CANCELED_TOKEN_MESSAGE = 'canceled'

const LikesAndComments = ({ model }) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const isLikedCancelTokens = useRef({
    true: axios.CancelToken.source(),
    false: axios.CancelToken.source(),
  })
  const currentUserId = parseInt(useCurrentUserId())

  const [stateLikes, setStateLikes] = useState(model.likes || [])

  const isLiked = useMemo(() => (stateLikes.indexOf(currentUserId) > -1 ? true : false), [
    stateLikes,
    currentUserId,
  ])

  const handleLikeButton = () => {
    changeLikes(!isLiked)
    const onError = (e = {}) => {
      if (e.message !== CANCELED_TOKEN_MESSAGE) {
        changeLikes(isLiked)
      }
    }
    const onFinish = newLikes => setStateLikes(newLikes)

    isLikedCancelTokens.current[isLiked].cancel(CANCELED_TOKEN_MESSAGE)
    isLikedCancelTokens.current[!isLiked] = axios.CancelToken.source()
    dispatch(isLiked ? types.UNLIKE_MODEL_CARD : types.LIKE_MODEL_CARD, {
      model,
      onFinish,
      onError,
      cancelToken: isLikedCancelTokens.current[!isLiked].token,
    })
  }

  const changeLikes = isLiked => {
    if (isLiked) {
      setStateLikes(stateLikes => [...stateLikes, currentUserId])
    } else {
      setStateLikes(stateLikes => stateLikes.filter(value => value !== currentUserId))
    }
  }

  return (
    <div className={c.ModelCard_LikesAndComments}>
      <span className={c.ModelCard_ActivityCount} title='Comments'>
        <ChatIcon />
        {model.commentsCount}
      </span>
      <span
        title='Like'
        className={c.ModelCard_ActivityCount}
        onClick={e => {
          if (!isNaN(currentUserId)) {
            e.preventDefault()
            handleLikeButton()
          }
        }}
      >
        {isLiked ? (
          <HeartFilledIcon className={c.ModelCard_Icon__liked} />
        ) : (
          <HeartIcon />
        )}
        {stateLikes.length}
      </span>
    </div>
  )
}

const Anchor = ({ children, attributionUrl, to, noLink, ...props }) => {
  if (noLink) return children
  return attributionUrl ? (
    <a href={attributionUrl} target='_blank' rel='noopener noreferrer' {...props}>
      {children}
    </a>
  ) : (
    <Link to={to.pathname} {...props}>
      {children}
    </Link>
  )
}

const CardContents = ({
  className,
  c,
  model,
  modelPath,
  modelAttributionUrl,
  isCurrentUserOwner,
  geoRelated,
}) => {
  const userName = R.pathOr('no-user', ['owner', 'username'], model)
  const onAnchorClick = useCallback(() => {
    if (geoRelated) track('Geo Related Model Link', { path: modelPath })
  }, [geoRelated, modelPath])

  return (
    <div
      title={modelAttributionUrl || model.name || model.fileName}
      className={classnames(className, c.ModelCard)}
      data-cy={R.pathOr('unknown', (['name'], model))}
    >
      <Link
        title={userName}
        to={{
          pathname: `/${userName}`,
          state: { fromModel: true },
        }}
      >
        <UserInline
          user={model.owner}
          size={24}
          maxLength={20}
          className={c.ModelCard_UserLine}
        />
      </Link>

      <Anchor
        onClick={onAnchorClick}
        to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
        attributionUrl={modelAttributionUrl}
        noLink={!modelPath}
      >
        <ModelThumbnail
          name={model.name}
          model={model}
          className={c.ModelCard_Thumbnail}
        />

        <div className={c.ModelCard_Footer}>
          <div className={c.ModelCard_Name}>{model.name}</div>
          <LikesAndComments model={model} />
        </div>
      </Anchor>

      {isCurrentUserOwner && (
        <EditModel className={c.ModelCard_EditModel} model={model} />
      )}
    </div>
  )
}

const ModelCard = ({ className, model, geoRelated }) => {
  const c = useStyles()
  const currentUserId = parseInt(useCurrentUserId())
  const modelAttributionUrl =
    model && model.attributionUrl && encodeURI(model.attributionUrl)
  const modelPath = model.id ? `/model/${model.id}` : modelAttributionUrl
  const isCurrentUserOwner = `${currentUserId}` === `${R.path(['owner', 'id'], model)}`

  return (
    <CardContents
      className={className}
      model={model}
      c={c}
      modelAttributionUrl={modelAttributionUrl}
      modelPath={modelPath}
      isCurrentUserOwner={isCurrentUserOwner}
      geoRelated={geoRelated}
    />
  )
}

export default ModelCard
