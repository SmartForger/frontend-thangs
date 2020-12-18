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
import { useCurrentUserId } from '@hooks'
import { track } from '@utilities/analytics'

const CANCELED_TOKEN_MESSAGE = 'canceled'

const LikesAndComments = ({ c, model }) => {
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
    if (geoRelated)
      track('Geo Related Model Link', {
        path: modelPath,
        origin: window.location.pathname,
      })
  }, [geoRelated, modelPath])

  const modelTitle = useMemo(() => {
    if (modelAttributionUrl) return modelAttributionUrl
    if (model) {
      if (model.name) {
        return model.name
      }
      if (model.parts && model.parts.length) {
        return model.parts[0].fileName
      }
      if (model.fileName) return model.fileName
      return 'unknown'
    }
  }, [model, modelAttributionUrl])

  return (
    <div
      title={modelTitle}
      className={classnames(className, c.ModelCard)}
      data-cy={R.pathOr('unknown', ['name'], model)}
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
          <LikesAndComments model={model} c={c} />
        </div>
      </Anchor>

      {isCurrentUserOwner && (
        <EditModel className={c.ModelCard_EditModel} model={model} />
      )}
    </div>
  )
}

const ModelCardBase = ({ c, className, model, geoRelated }) => {
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

export default ModelCardBase
