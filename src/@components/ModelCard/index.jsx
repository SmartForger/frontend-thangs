import React from 'react'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import classnames from 'classnames'
import { ReactComponent as ChatIcon } from '@svg/icon-comment.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as ExternalLinkIcon } from '@svg/external-link.svg'
import { ReactComponent as FlagIcon } from '@svg/flag-icon.svg'
import { Button, Card, ModelThumbnail, UserInline, EditModel } from '@components'
import { createUseStyles } from '@style'
import { useCurrentUserId } from '@hooks'

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
    ModelCard_EditModel: {
      position: 'absolute',
      right: '1rem',
      top: '1rem',
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
  let modelLikeCount = model && model.likes && model.likes.length
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
              <ChatIcon />
              &nbsp;{model.commentsCount}
            </span>
            <span className={c.ModelCard_ActivityCount}>
              <HeartIcon
                className={classnames(c.ModelCard_Icon, {
                  [c.ModelCard_Icon__liked]: isLiked,
                })}
              />
              &nbsp;{modelLikeCount}
            </span>
          </div>
        </div>
      )}
      {showReportModel && (
        <Button
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
  showReportModel,
  handleReportModel = noop,
}) => {
  return (
    <div className={c.ModelCard_Content}>
      <div className={c.ModelCard_DetailsInline}>
        <ExternalLinkIcon />
        <span
          className={c.ModelCard_ExternalName}
          title={model.attributionUrl || model.fileName}
        >
          {model.attributionUrl || model.fileName}
        </span>
        {showReportModel && (
          <Button
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
  if (model.resultSource === 'phyndexer' && !modelAttributionUrl) return null
  return (
    <>
      <div title={modelAttributionUrl || model.name || model.fileName}>
        <Card className={classnames(className, c.ModelCard)}>
          <ModelThumbnail
            className={c.ModelCard_Thumbnail}
            name={model.name}
            model={model}
            searchModelFileName={searchModelFileName}
            showWaldo={showWaldo}
          />
        </Card>
        <div>
          {model.resultSource === 'phyndexer' ? (
            <ExternalModelDetails
              c={c}
              model={model}
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

const ModelCard = ({
  className,
  model,
  withOwner,
  showSocial = true,
  showWaldo,
  showReportModel,
  searchModelFileName,
  handleReportModel,
}) => {
  const c = useStyles()
  const currentUserId = parseInt(useCurrentUserId())
  const showOwner = withOwner && !!model.owner
  const isLiked = model && model.likes && model.likes.includes(currentUserId)
  const modelAttributionUrl =
    model && model.attributionUrl && encodeURI(model.attributionUrl)
  const modelPath = model.id ? `/model/${model.id}` : modelAttributionUrl
  const isCurrentUserOwner = `${currentUserId}` === `${R.path(['owner', 'id'], model)}`
  return (
    <div className={c.ModelCard}>
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
      {isCurrentUserOwner && (
        <EditModel className={c.ModelCard_EditModel} model={model} />
      )}
    </div>
  )
}

export default ModelCard
