import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import * as R from 'ramda'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { ReactComponent as ChatIcon } from '@svg/icon-comment.svg'
import { ReactComponent as GlobeIcon } from '@svg/icon-globe2.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as HeartFilledIcon } from '@svg/heart-filled-icon.svg'
import * as types from '@constants/storeEventTypes'
import { MetadataSecondary, ModelThumbnail, UserInline } from '@components'
import { useCurrentUserId } from '@hooks'
import { track } from '@utilities/analytics'

const CANCELED_TOKEN_MESSAGE = 'canceled'

const LikesAndComments = ({ c, model }) => {
  const currentUserId = parseInt(useCurrentUserId())
  const { dispatch, [`user-${currentUserId}`]: userAtom = {} } = useStoreon(
    `user-${currentUserId}`
  )
  const isLikedCancelTokens = useRef({
    true: axios.CancelToken.source(),
    false: axios.CancelToken.source(),
  })

  const [likesCount, setLikesCount] = useState(model.likesCount || 0)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const likes = R.pathOr([], ['data', 'likes'], userAtom)
    const isModelInLikedArray = R.includes(parseInt(model.id), likes)

    setIsLiked(isModelInLikedArray)
  }, [model, userAtom])

  const handleLikeButton = () => {
    const newIsLiked = !isLiked
    setIsLiked(newIsLiked)
    changeLikes(newIsLiked)

    const onError = (e = {}) => {
      if (e.message !== CANCELED_TOKEN_MESSAGE) {
        changeLikes(newIsLiked)
      }
    }

    const onFinish = newLikes => setLikesCount(newLikes)

    isLikedCancelTokens.current[isLiked].cancel(CANCELED_TOKEN_MESSAGE)
    isLikedCancelTokens.current[!isLiked] = axios.CancelToken.source()

    dispatch(types.LIKE_MODEL_CARD, {
      modelId: model.id,
      isLiked: newIsLiked,
      onFinish,
      onError,
      cancelToken: isLikedCancelTokens.current[newIsLiked].token,
    })
  }

  const changeLikes = isLiked => {
    setLikesCount(likesCount + (isLiked ? 1 : -1))
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
        {isLiked ? Math.max(likesCount, 1) : Math.max(likesCount, 0)}
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
  geoRelated,
  onClick,
  spotCheckIndex,
  spotCheckRef,
}) => {
  const userName = R.pathOr('no-user', ['owner', 'username'], model)

  const onAnchorClick = useCallback(() => {
    if (geoRelated) {
      track('Geo Related Model Link', {
        path: modelPath,
        origin: window.location.pathname,
      })
    } else {
      onClick(spotCheckIndex)
    }
  }, [geoRelated, modelPath, onClick, spotCheckIndex])

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
      ref={spotCheckRef}
    >
      {userName !== 'no-user' ? (
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
      ) : (
        <a
          className={c.ModelCard_ExternalLine}
          href={modelAttributionUrl}
          target='_blank'
          rel='noopener noreferrer'
        >
          <GlobeIcon />
          <MetadataSecondary light className={c.ModelCard_AttributionUrl}>
            {modelAttributionUrl}
          </MetadataSecondary>
        </a>
      )}
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
          {userName !== 'no-user' && <LikesAndComments model={model} c={c} />}
        </div>
      </Anchor>
    </div>
  )
}

const ModelCardBase = ({
  c,
  className,
  model,
  geoRelated,
  onClick,
  spotCheckIndex,
  spotCheckRef,
}) => {
  const currentUserId = parseInt(useCurrentUserId())
  const modelAttributionUrl =
    model && model.attributionUrl && encodeURI(model.attributionUrl)
  const modelIdPath = model.id ? `/model/${model.id}` : modelAttributionUrl
  const modelPath = model.identifier ? `/${model.identifier}` : modelIdPath
  const isCurrentUserOwner = `${currentUserId}` === `${R.path(['owner', 'id'], model)}`

  return (
    <CardContents
      className={className}
      attributionUrl
      model={model}
      c={c}
      modelAttributionUrl={modelAttributionUrl}
      modelPath={modelPath}
      isCurrentUserOwner={isCurrentUserOwner}
      geoRelated={geoRelated}
      onClick={onClick}
      spotCheckIndex={spotCheckIndex}
      spotCheckRef={spotCheckRef}
    />
  )
}

export default ModelCardBase
