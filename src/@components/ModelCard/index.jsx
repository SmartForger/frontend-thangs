import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import * as R from 'ramda'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { ReactComponent as ChatIcon } from '@svg/icon-comment.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import * as types from '@constants/storeEventTypes'
import { Card, ModelThumbnail, UserInline, EditModel } from '@components'
import { createUseStyles } from '@style'
import { useCurrentUserId } from '@hooks'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(theme => {
  return {
    ModelCard: {
      position: 'relative',
    },
    ModelCard_Thumbnail: {
      paddingBottom: 0,
      minHeight: '12.25rem',
      margin: 'auto',
      maxWidth: '100%',
      width: '100%',
      borderRadius: '.5rem .5rem 0 0',
    },
    ModelCard_Content: {
      padding: '.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
    },
    ModelCard_Name: {
      ...theme.text.regularText,
    },
    ModelCard_DetailsInline: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    ModelCard_ExternalName: {
      marginLeft: '.5rem',
      flexGrow: 1,
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.black[500],
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: '20rem',
    },
    ModelCard_Row: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    ModelCard_ActivityIndicators: {
      display: 'flex',
      flexDirection: 'row',

      '& > span:not(:last-child)': {
        marginRight: '1rem',
      },
    },
    ModelCard_ActivityCount: {
      ...theme.text.thumbnailActivityCountText,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,
    },
    ModelCard_Icon: {
      '& path': {
        fill: theme.colors.grey[300],
      },
    },
    ModelCard_Icon__liked: {
      '& path': {
        fill: theme.colors.gold[500],
      },
    },
    ModelCard_ThangsLink: {
      zIndex: 1,
    },
    ModelCard_ReportModelButton: {
      '& > svg': {
        margin: '0 !important',
      },
    },
    ModelCard_EditModel: {
      position: 'absolute',
      right: '1rem',
      top: '1rem',
    },
  }
})

const CANCELED_TOKEN_MESSAGE = 'canceled'

const ThangsModelDetails = ({ c, model }) => {
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

  const userName = R.pathOr('no-user', ['owner', 'username'], model)
  return (
    <div className={c.ModelCard_Content}>
      <Link
        title={userName}
        to={{
          pathname: `/${userName}`,
          state: { fromModel: true },
        }}
      >
        <UserInline user={model.owner} maxLength={20} />
      </Link>

      <div className={c.ModelCard_Row}>
        <div className={c.ModelCard_ActivityIndicators}>
          <span className={c.ModelCard_ActivityCount}>
            <ChatIcon />
            &nbsp;{model.commentsCount}
          </span>
          <span
            className={c.ModelCard_ActivityCount}
            onClick={e => {
              if (!isNaN(currentUserId)) {
                e.preventDefault()
                handleLikeButton()
              }
            }}
          >
            <HeartIcon
              className={classnames(c.ModelCard_Icon, {
                [c.ModelCard_Icon__liked]: isLiked,
              })}
            />
            &nbsp;{stateLikes.length}
          </span>
        </div>
      </div>
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

const CardContents = ({ className, c, model, modelAttributionUrl }) => {
  return (
    <div title={modelAttributionUrl || model.name || model.fileName}>
      <Card className={classnames(className, c.ModelCard)}>
        <ModelThumbnail
          className={c.ModelCard_Thumbnail}
          name={model.name}
          model={model}
        />
      </Card>
      <ThangsModelDetails c={c} model={model} />
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
  const onAnchorClick = useCallback(() => {
    if (geoRelated) track('Geo Related Model Link', { path: modelPath })
  }, [geoRelated, modelPath])

  return (
    <div className={c.ModelCard} data-cy={R.pathOr('unknown', (['name'], model))}>
      <Anchor
        onClick={onAnchorClick}
        to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
        attributionUrl={modelAttributionUrl}
        className={c.ModelCard_ThangsLink}
        noLink={!modelPath}
      >
        <CardContents
          className={className}
          model={model}
          c={c}
          modelAttributionUrl={modelAttributionUrl}
          modelPath={modelPath}
        />
      </Anchor>
      {isCurrentUserOwner && (
        <EditModel className={c.ModelCard_EditModel} model={model} />
      )}
    </div>
  )
}

export default ModelCard
