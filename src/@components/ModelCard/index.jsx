import React from 'react'
import * as R from 'ramda'
import { Link } from 'react-router-dom'
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as ExternalLinkIcon } from '@svg/external-link.svg'
import { ReactComponent as ViewOnlyIcon } from '@svg/view-only-icon.svg'
import { ReactComponent as FlagIcon } from '@svg/flag-icon.svg'
import { Button, Card, ModelThumbnail, UserInline } from '@components'
import { THUMBNAILS_HOST, TIW_THUMBNAILS_HOST } from '@utilities/constants'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    ModelCard: {
      position: 'relative',
    },
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
      ...theme.mixins.text.thumbnailActivityCountText,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,
    },
    ModelCard_LikedIcon: {
      '& path': {
        fill: theme.colors.gold[500],
      },
    },
    ModelCard_ExternalLink: {
      zIndex: 1,
    },
    ModelCard_ThangsLink: {
      zIndex: 1,
    },
    ModelCard_ReportModelButton: {
      '& > svg': {
        margin: '0 !important',
      },
    },
  }
})

const noop = () => null

const ThangsModelDetails = ({
  c,
  model,
  showOwner,
  showSocial,
  isLiked = false,
  showReportModel,
  handleReportModel = noop,
}) => {
  let modelName = model.name
  if (modelName && modelName.length > 40) modelName = modelName.slice(0, 40) + '...'
  let modelLikeCount = model && model.likesCount
  if (modelLikeCount && Array.isArray(modelLikeCount))
    modelLikeCount = modelLikeCount.length
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
              &nbsp;{modelLikeCount}
            </span>
          </div>
        </div>
      )}
      {showReportModel && (
        <Button
          icon
          className={c.ModelCard_ReportModelButton}
          onClick={() => handleReportModel({ model })}
        >
          <FlagIcon />
        </Button>
      )}
    </div>
  )
}

const ExternalModelDetails = ({
  c,
  model,
  isLink,
  showReportModel,
  handleReportModel = noop,
}) => {
  return (
    <div className={c.ModelCard_Content}>
      <div className={c.ModelCard_DetailsInline}>
        {isLink ? <ExternalLinkIcon /> : <ViewOnlyIcon title={'View Only'} />}
        <span
          className={c.ModelCard_ExternalName}
          title={model.attributionUrl || model.fileName}
        >
          {model.attributionUrl || model.fileName}
        </span>
        {showReportModel && (
          <Button
            icon
            className={c.ModelCard_ReportModelButton}
            onClick={() => handleReportModel({ model })}
          >
            <FlagIcon />
          </Button>
        )}
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

const getThumbnailFileName = (model = {}) => {
  if (model.uploadedFile) return model.uploadedFile
  if (model.fileName) return model.fileName.replace('uploads/models/', '')
  if (model.modelFileName) return model.modelFileName.replace('uploads/models/', '')
}

const getWaldoThumbnailUrl = (model = {}, searchModelFileName) => {
  if (searchModelFileName) return searchModelFileName.replace('uploads/models/', '')
  if (model.searchModel) return model.searchModel.replace('uploads/models/', '')
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
  showOwner,
  showSocial,
  showWaldo,
  isLiked,
  modelAttributionUrl,
  searchModelFileName,
  showReportModel,
  handleReportModel,
}) => {
  const thumbnailUrl = model.fullThumbnailUrl
    ? model.fullThumbnailUrl
    : model.thumbnailUrl
      ? model.thumbnailUrl
      : `${THUMBNAILS_HOST}/${getThumbnailUrl(model)}`

  const waldoThumbnailUrl = searchModelFileName
    ? `${TIW_THUMBNAILS_HOST}/${getThumbnailFileName(model)}/${getWaldoThumbnailUrl(
      model,
      searchModelFileName
    )}`
    : undefined

  return (
    <>
      <div title={modelAttributionUrl || model.name || model.fileName}>
        <Card className={classnames(className, c.ModelCard)}>
          <ModelThumbnail
            className={c.ModelCard_Thumbnail}
            name={model.name}
            model={model}
            thumbnailUrl={thumbnailUrl}
            waldoThumbnailUrl={showWaldo ? waldoThumbnailUrl : undefined}
          ></ModelThumbnail>
        </Card>
        <div>
          {model.resultSource === 'phyndexer' ? (
            <ExternalModelDetails
              c={c}
              model={model}
              isLink={!!modelAttributionUrl}
              showReportModel={showReportModel}
              handleReportModel={handleReportModel}
            />
          ) : (
            <ThangsModelDetails
              c={c}
              model={model}
              showOwner={showOwner}
              showSocial={showSocial}
              isLiked={isLiked}
              showReportModel={showReportModel}
              handleReportModel={handleReportModel}
            />
          )}
        </div>
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

const ModelCard = ({
  className,
  model,
  withOwner,
  user,
  likes,
  showSocial = true,
  showWaldo,
  showReportModel,
  searchModelFileName,
  handleReportModel,
}) => {
  const c = useStyles()
  const showOwner = withOwner && !!model.owner
  const isLiked = user ? hasLikedModel(model, user) : likes
  const modelAttributionUrl =
    model && model.attributionUrl && encodeURI(model.attributionUrl)
  const modelPath = model.id ? `/model/${model.id}` : modelAttributionUrl
  return (
    <Anchor
      to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
      attributionUrl={modelAttributionUrl}
      className={classnames({
        [c.ModelCard_ExternalLink]: model.resultSource === 'phyndexer',
        [c.ModelCard_ThangsLink]: model.resultSource !== 'phyndexer',
      })}
      noLink={!modelPath || showReportModel}
    >
      <CardContents
        className={className}
        model={model}
        showOwner={showOwner}
        showSocial={showSocial}
        showWaldo={showWaldo}
        c={c}
        isLiked={isLiked}
        modelAttributionUrl={modelAttributionUrl}
        searchModelFileName={searchModelFileName}
        modelPath={modelPath}
        showReportModel={showReportModel}
        handleReportModel={handleReportModel}
      />
    </Anchor>
  )
}

export default ModelCard
