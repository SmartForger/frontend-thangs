import React, { useCallback, useState } from 'react'
import * as R from 'ramda'
import { Link } from 'react-router-dom'
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as GlobeIcon } from '@svg/icon-globe.svg'
import { Card, ModelThumbnail, UserInline } from '@components'
import { THUMBNAILS_HOST, TIW_THUMBNAILS_HOST } from '@utilities/constants'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelCard: {},
    ModelCard_Thumbnail: {
      paddingBottom: 0,
      minHeight: '12.25rem',
      margin: 'auto',
      maxWidth: 'calc(100% - 7.375rem)',
      width: '100%',
      borderRadius: '.5rem .5rem 0 0',
    },
    ModelCard_Content: {
      padding: '.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
    },
    ModelCard_Name: {
      ...theme.mixins.text.regularText,
    },
    ModelCard_DetailsInline: {
      display: 'flex',
      alignItems: 'center',
    },
    ModelCard_ExternalName: {
      marginLeft: '.5rem',
      flexGrow: 1,
      fontSize: '1rem',
      fontWeight: '600',
      color: theme.colors.black[500],
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
      ...theme.mixins.text.thumbnailActivityCountText,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,
    },
    ModelCard_LikedIcon: {
      fill: theme.colors.gold[500],
      stroke: theme.colors.gold[500],
      '& path': {
        fill: theme.colors.gold[500],
      },
    },
  }
})

const ThangsModelDetails = ({ c, model, showOwner, showSocial, isLiked = false }) => {
  let modelName = model.name
  if (modelName && modelName.length > 40) modelName = modelName.slice(0, 40) + '...'
  return (
    <div className={c.ModelCard_Content}>
      {!showOwner && <div className={c.ModelCard_Name}>{modelName}</div>}
      {showOwner && <UserInline user={model.owner} />}
      {showSocial && (
        <div className={c.ModelCard_Row}>
          <div className={c.ModelCard_ActivityIndicators}>
            <span className={c.ModelCard_ActivityCount}>
              <ChatIcon className={c.ModelCard_Icon} />
              &nbsp;{model.commentsCount}
            </span>
            <span className={c.ModelCard_ActivityCount}>
              <HeartIcon
                className={classnames(c.ModelCard_Icon, {
                  [c.ModelCard_LikedIcon]: isLiked,
                })}
              />
              &nbsp;{model.likesCount}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

const ExternalModelDetails = ({ c, model }) => {
  return (
    <div className={c.ModelCard_Content}>
      <div className={c.ModelCard_DetailsInline}>
        <GlobeIcon width={'28px'} height={'28px'} />
        <span className={c.ModelCard_ExternalName}>Replace/this/with/url</span>
      </div>
    </div>
  )
}

const getThumbnailUrl = (model = {}) => {
  if (model.thumbnailUrl) return model.thumbnailUrl
  if (model.uploadedFile) return model.uploadedFile
  if (model.fileName) return model.fileName.replace('uploads/models/', '')
  if (model.modelFileName) return model.modelFileName.replace('uploads/models/', '')
}

const getTIWThumbnailUrl = (model = {}) => {
  if (model.searchModel) return model.searchModel.replace('uploads/models/', '')
}

const CardContents = ({ className, c, model, showOwner, showSocial, isLiked }) => {
  const thumbnailUrl = model.fullThumbnailUrl
    ? model.fullThumbnailUrl
    : `${THUMBNAILS_HOST}/${getThumbnailUrl(model)}`

  const tiwThumbnailUrl = model.tiwFullThumbnailUrl
    ? model.tiwFullThumbnailUrl
    : model.searchModel
    ? `${TIW_THUMBNAILS_HOST}/${getThumbnailUrl(model)}/${getTIWThumbnailUrl(model)}`
    : undefined

  return (
    <>
      <div title={model && model.name}>
        <Card className={className}>
          <ModelThumbnail
            className={c.ModelCard_Thumbnail}
            name={model.name}
            thumbnailUrl={thumbnailUrl}
            //Here is what would entail to call the Waldo thumbnail Url
            tiwThumbnailUrl={tiwThumbnailUrl}
          ></ModelThumbnail>
        </Card>
        {model.resultSource === 'phyndexer' ? (
          <ExternalModelDetails c={c} model={model} />
        ) : (
          <ThangsModelDetails
            c={c}
            model={model}
            showOwner={showOwner}
            showSocial={showSocial}
            isLiked={isLiked}
          />
        )}
      </div>
    </>
  )
}

const userIdsWhoHaveLiked = R.pipe(
  R.prop('likes'),
  R.filter(R.propEq('isLiked', true)),
  R.map(R.path(['ownerId']))
)

const hasLikedModel = (model, user) => {
  return R.includes(parseInt(user.id), userIdsWhoHaveLiked(model))
}

const ModelCard = ({ className, model, withOwner, user, likes, showSocial = true }) => {
  const c = useStyles()
  const showOwner = withOwner && model.owner
  const [hovered, setHovered] = useState(false)
  const handleMouseEnter = useCallback(() => setHovered(true), [])
  const handleMouseLeave = useCallback(() => setHovered(false), [])
  const isLiked = user ? hasLikedModel(model, user) : likes
  const modelPath = model && model.id ? `/model/${model.id}` : '/'
  return (
    <Link
      to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      <CardContents
        className={className}
        model={model}
        showOwner={showOwner}
        showSocial={showSocial}
        hovered={hovered}
        c={c}
        isLiked={isLiked}
      />
    </Link>
  )
}

export default ModelCard
