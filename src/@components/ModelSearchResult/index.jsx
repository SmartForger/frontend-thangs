import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ChatIcon } from '@svg/chat-icon.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as ExternalLinkIcon } from '@svg/external-link.svg'
import { ReactComponent as FlagIcon } from '@svg/flag-icon.svg'
import { ReactComponent as MagnifyingGlass } from '@svg/magnifying-glass-header.svg'
import { Button, Card, ModelThumbnail, UserInline } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import useCurrentUserId from '../../@hooks/useCurrentUserId'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    ModelSearchResult: {},
    ModelSearchResult_ThumbnailWrapper: {
      position: 'relative',
      width: '100%',
      minWidth: '10rem',
      marginRight: '1.5rem',

      [md]: {
        width: '8.25rem',
        height: '8.75rem !important',
      },

      '&:after': {
        content: '',
        display: 'block',
        paddingBottom: '100%',
      },
    },
    ModelSearchResult_Thumbnail: {
      width: '100%',
      padding: '0 !important',
      margin: 'auto',
      borderRadius: '.5rem .5rem 0 0',
      minHeight: '12.25rem',

      [md]: {
        minHeight: 0,
        maxWidth: '100%',
      },
    },
    ModelSearchResult_ResultContents: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '1.5rem',

      [md]: {
        flexDirection: 'row',
      },
    },
    ModelSearchResult_Content: {
      padding: '.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    ModelSearchResult_UserDetails: {
      display: 'flex',
    },
    ModelSearchResult_Name: {
      fontSize: '1.125rem',
      lineHeight: '1.125rem',
      fontWeight: 600,
      marginTop: '.5rem',
      color: theme.colors.purple[900],
    },
    ModelSearchResult_Description: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 500,
      marginTop: '.5rem',
      color: theme.colors.grey[700],
    },
    ModelSearchResult_DetailsInline: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    ModelSearchResult_ExternalUrlWrapper: {
      display: 'flex',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',

      '& > div': {
        marginRight: '.25rem',
      },
    },
    ModelSearchResult_ExternalUrl: {
      flexGrow: 1,
      fontSize: '.75rem',
      fontWeight: '600',
      color: theme.colors.grey[300],
      overflow: 'hidden',
    },
    ModelSearchResult_Row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginLeft: '.5rem',
    },
    ModelSearchResult_ActivityIndicators: {
      display: 'flex',
      flexDirection: 'row',

      '& > span:not(:last-child)': {
        marginRight: '1rem',
      },
    },
    ModelSearchResult_ActivityCount: {
      ...theme.mixins.text.thumbnailActivityCountText,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,

      '& svg': {
        marginRight: '.25rem',
      },
    },
    ModelSearchResult_LikedIcon: {
      '& path': {
        fill: theme.colors.gold[500],
      },
    },
    ModelSearchResult_ExternalLink: {
      zIndex: 1,
    },
    ModelSearchResult_ThangsLink: {
      zIndex: 1,
    },
    ModelSearchResult_ReportModelButton: {
      '& > svg': {
        margin: '0 !important',
      },
    },
    ModelSearchResult_FindSimilarLink: {
      color: theme.colors.gold[500],
      marginTop: '.5rem',
      fontSize: '1rem',
      lineHeight: '1rem',
    },
  }
})

const noop = () => null

const ThangsModelDetails = ({
  c,
  model,
  modelPath,
  isLiked = false,
  showReportModel,
  handleReportModel = noop,
  handleFindSimilar = noop,
}) => {
  let modelName = model.name
  if (modelName && modelName.length > 40) modelName = modelName.slice(0, 40) + '...'
  let modelLikeCount = model && model.likes && model.likes.length
  if (modelLikeCount && Array.isArray(modelLikeCount))
    modelLikeCount = modelLikeCount.length
  return (
    <div className={c.ModelSearchResult_Content}>
      <Anchor to={{ pathname: modelPath, state: { prevPath: window.location.href } }}>
        <div className={c.ModelSearchResult_UserDetails}>
          <UserInline size='1.25rem' user={model.owner} isSearchResult={true} />
          <div className={c.ModelSearchResult_Row}>
            <div className={c.ModelSearchResult_ActivityIndicators}>
              <span className={c.ModelSearchResult_ActivityCount}>
                <ChatIcon className={c.ModelSearchResult_Icon} />
                {model.commentsCount}
              </span>
              <span className={c.ModelSearchResult_ActivityCount}>
                <HeartIcon
                  className={classnames(c.ModelSearchResult_Icon, {
                    [c.ModelSearchResult_LikedIcon]: isLiked,
                  })}
                />
                {modelLikeCount}
              </span>
            </div>
          </div>
        </div>
        <div className={c.ModelSearchResult_Name}>{modelName}</div>
        <div className={c.ModelSearchResult_Description}>{model.description}</div>
      </Anchor>
      <Button
        text
        className={c.ModelSearchResult_FindSimilarLink}
        onClick={() => handleFindSimilar({ model })}
      >
        <MagnifyingGlass /> Find Similar Models
      </Button>
      {showReportModel && (
        <Button
          icon
          className={c.ModelSearchResult_ReportModelButton}
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
  model = {},
  modelAttributionUrl,
  modelPath,
  showReportModel,
  handleReportModel = noop,
  handleFindSimilar = noop,
}) => {
  const { modelTitle, modelDescription, modelFileName } = model
  let formattedModelDescription = modelDescription
  if (modelDescription && modelDescription.length > 144)
    formattedModelDescription = formattedModelDescription.slice(0, 144) + '...'
  return (
    <div className={c.ModelSearchResult_Content}>
      <Anchor
        to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
        attributionUrl={modelAttributionUrl}
      >
        <div className={c.ModelSearchResult_ExternalUrlWrapper}>
          <div>
            <span
              className={c.ModelSearchResult_ExternalUrl}
              title={model.attributionUrl}
            >
              {model.attributionUrl}
            </span>
          </div>
          <div>
            <ExternalLinkIcon />
          </div>
        </div>
        <div className={c.ModelSearchResult_Name}>{modelTitle || modelFileName}</div>
        <div className={c.ModelSearchResult_Description}>{formattedModelDescription}</div>
      </Anchor>
      <Button
        text
        className={c.ModelSearchResult_FindSimilarLink}
        onClick={() => handleFindSimilar({ model })}
      >
        <MagnifyingGlass /> Find Similar Models
      </Button>
      {showReportModel && (
        <Button
          icon
          className={c.ModelSearchResult_ReportModelButton}
          onClick={() => handleReportModel({ model })}
        >
          <FlagIcon />
        </Button>
      )}
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

const ResultContents = ({
  c,
  className,
  model,
  modelAttributionUrl,
  modelPath,
  handleReportModel = noop,
  handleFindSimilar = noop,
  isLiked,
  searchModelFileName,
  showOwner,
  showReportModel,
  showSocial,
  showWaldo,
}) => {
  if (model.resultSource === 'phyndexer' && !modelAttributionUrl) return null
  return (
    <div className={c.ModelSearchResult_ResultContents}>
      <Anchor
        to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
        attributionUrl={modelAttributionUrl}
      >
        <Card className={classnames(className, c.ModelSearchResult_ThumbnailWrapper)}>
          <ModelThumbnail
            className={c.ModelSearchResult_Thumbnail}
            name={model.name}
            model={model}
            searchModelFileName={searchModelFileName}
            showWaldo={showWaldo}
          />
        </Card>
      </Anchor>
      <div>
        {model.resultSource === 'phyndexer' ? (
          <ExternalModelDetails
            c={c}
            model={model}
            modelAttributionUrl={modelAttributionUrl}
            modelPath={modelPath}
            showReportModel={showReportModel}
            handleReportModel={handleReportModel}
            handleFindSimilar={handleFindSimilar}
          />
        ) : (
          <ThangsModelDetails
            c={c}
            model={model}
            modelPath={modelPath}
            showOwner={showOwner}
            showSocial={showSocial}
            isLiked={isLiked}
            showReportModel={showReportModel}
            handleReportModel={handleReportModel}
            handleFindSimilar={handleFindSimilar}
          />
        )}
      </div>
    </div>
  )
}

const ModelSearchResult = ({
  className,
  model,
  withOwner,
  showSocial = true,
  showWaldo,
  showReportModel,
  searchModelFileName,
  handleReportModel = noop,
  handleFindSimilar = noop,
}) => {
  const c = useStyles()
  const currentUserId = parseInt(useCurrentUserId())
  const showOwner = withOwner && !!model.owner
  const isLiked = model && model.likes && model.likes.includes(currentUserId)
  const modelAttributionUrl =
    model && model.attributionUrl && encodeURI(model.attributionUrl)
  const modelPath = model.id ? `/model/${model.id}` : modelAttributionUrl
  return (
    <div
      className={classnames({
        [c.ModelSearchResult_ExternalLink]: model.resultSource === 'phyndexer',
        [c.ModelSearchResult_ThangsLink]: model.resultSource !== 'phyndexer',
      })}
    >
      <ResultContents
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
        handleFindSimilar={handleFindSimilar}
      />
    </div>
  )
}

export default ModelSearchResult
