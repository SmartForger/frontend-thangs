import React, { useCallback, useContext } from 'react'
import classnames from 'classnames'
import { Link } from 'react-router-dom'

import { createUseStyles } from '@physna/voxel-ui/@style'

import {
  Card,
  ModelThumbnail,
  UserInline,
  SearchResultDetailsMenu,
  SearchResultFooter,
  Spacer,
  ContainerRow,
} from '@components'
import { useCurrentUserId } from '@hooks'
import { truncateString } from '@utilities'
import { track } from '@utilities/analytics'
import { SearchActionContext } from '@pages/SearchResults/SearchActions'

import { ReactComponent as ChatIcon } from '@svg/icon-comment.svg'
import { ReactComponent as HeartIcon } from '@svg/heart-icon.svg'
import { ReactComponent as ExternalLinkIcon } from '@svg/external-link.svg'

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
        width: '16.25rem',
        height: '16.25rem !important',
      },

      '&:after': {
        content: '',
        display: 'block',
        paddingBottom: '100%',
      },
    },
    ModelSearchResult_Thumbnail: {
      width: '100%',
      height: '100%',
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
    ModelSearchResult_Column: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      height: '100%',
    },
    ModelSearchResult_Content: {
      padding: '.5rem 0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    ModelSearchResult_Name: {
      fontSize: '1.125rem',
      lineHeight: '1.125rem',
      fontWeight: '600',
      marginTop: '.5rem',
      color: theme.colors.purple[900],
    },
    ModelSearchResult_Description: {
      color: theme.colors.grey[700],
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1.5rem',
      marginTop: '.25rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    ModelSearchResult_DetailsInline: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    ModelSearchResult_ExternalUrlWrapper: {
      display: 'flex',
      alignItems: 'center',
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
      ...theme.text.thumbnailActivityCountText,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,

      '& svg': {
        marginRight: '.25rem',
      },
    },
    ModelSearchResult_Icon: {
      '& path': {
        fill: theme.colors.grey[300],
      },
    },
    ModelSearchResult_Icon__liked: {
      '& path': {
        fill: theme.colors.gold[500],
      },
    },
    ModelSearchResult_ExternalLink: {
      zIndex: '1',
    },
    ModelSearchResult_ThangsLink: {
      zIndex: '1',
    },
    ModelSearchResult_ReportModelButton: {
      '& > svg': {
        margin: '0 !important',
      },
    },
    ModelSearchResult_FindRelatedLink: {
      marginTop: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1rem',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    ModelSearchResult_ReportModelLink: {
      fontSize: '.75rem',
      fontWeight: '500',
      cursor: 'pointer',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
  }
})

const noop = () => null

const ThangsModelDetails = ({
  model,
  modelPath,
  isLiked = false,
  onReportModel = noop,
  handleFindRelated = noop,
}) => {
  const c = useStyles()
  let formattedModelName = truncateString(model.name, 40)
  let formattedModelDescription = truncateString(model.description, 144)
  let modelLikeCount = model && model.likes && model.likes.length
  if (modelLikeCount && Array.isArray(modelLikeCount))
    modelLikeCount = modelLikeCount.length
  return (
    <div className={c.ModelSearchResult_Column}>
      <div className={c.ModelSearchResult_Content}>
        <ContainerRow alignItems='center'>
          <Anchor to={{ pathname: modelPath, state: { prevPath: window.location.href } }}>
            <ContainerRow alignItems='center'>
              <UserInline size='1.25rem' user={model.owner} isSearchResult={true} />
              <div className={c.ModelSearchResult_Row}>
                <div className={c.ModelSearchResult_ActivityIndicators}>
                  <span className={c.ModelSearchResult_ActivityCount}>
                    <ChatIcon />
                    {model.commentsCount}
                  </span>
                  <span className={c.ModelSearchResult_ActivityCount}>
                    <HeartIcon
                      className={classnames(c.ModelSearchResult_Icon, {
                        [c.ModelSearchResult_Icon__liked]: isLiked,
                      })}
                    />
                    {modelLikeCount}
                  </span>
                </div>
              </div>
            </ContainerRow>
          </Anchor>
          <SearchResultDetailsMenu model={model} onReportModel={onReportModel} />
        </ContainerRow>
        <Anchor to={{ pathname: modelPath, state: { prevPath: window.location.href } }}>
          <div className={c.ModelSearchResult_Name}>{formattedModelName}</div>
          <div className={c.ModelSearchResult_Description}>
            {formattedModelDescription}
          </div>
        </Anchor>
        <Spacer size={'1.5rem'} />
        <SearchResultFooter model={model} onFindRelated={handleFindRelated} />
      </div>
    </div>
  )
}

const ExternalModelDetails = ({
  model = {},
  modelAttributionUrl,
  modelPath,
  onReportModel = noop,
  handleFindRelated = noop,
}) => {
  const c = useStyles()
  const { modelTitle, modelDescription, modelFileName } = model
  let formattedModelDescription = truncateString(modelDescription, 144)
  return (
    <div className={c.ModelSearchResult_Column}>
      <div className={c.ModelSearchResult_Content}>
        <div className={c.ModelSearchResult_ExternalUrlWrapper}>
          <Anchor
            to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
            attributionUrl={modelAttributionUrl}
          >
            <ContainerRow alignItems='center'>
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
            </ContainerRow>
          </Anchor>
          <SearchResultDetailsMenu model={model} onReportModel={onReportModel} />
        </div>
        <Anchor
          to={{ pathname: modelPath, state: { prevPath: window.location.href } }}
          attributionUrl={modelAttributionUrl}
        >
          <div className={c.ModelSearchResult_Name}>{modelTitle || modelFileName}</div>
          <div className={c.ModelSearchResult_Description}>
            {formattedModelDescription}
          </div>
        </Anchor>
        <Spacer size={'1.5rem'} />
        <SearchResultFooter model={model} onFindRelated={handleFindRelated} />
      </div>
    </div>
  )
}

const Anchor = ({ children, attributionUrl, to, noLink, ...props }) => {
  const onClick = useCallback(() => {
    if (attributionUrl) {
      track('External Model Link', { path: attributionUrl })
    } else {
      track('Thangs Model Link', { path: to.pathname })
    }
  }, [attributionUrl, to.pathname])

  if (noLink) return children
  return attributionUrl ? (
    <a
      href={attributionUrl}
      target='_blank'
      rel='noopener noreferrer'
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  ) : (
    <Link to={to.pathname} onClick={onClick} {...props}>
      {children}
    </Link>
  )
}

const ResultContents = ({
  className,
  model,
  modelAttributionUrl,
  modelPath,
  isLiked,
  searchModelFileName,
  showOwner,
  showSocial,
  showWaldo,
  onReportModel,
  handleFindRelated,
}) => {
  const c = useStyles()

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
        {model.scope === 'phyndexer' ? (
          <ExternalModelDetails
            model={model}
            modelAttributionUrl={modelAttributionUrl}
            modelPath={modelPath}
            onReportModel={onReportModel}
            handleFindRelated={handleFindRelated}
          />
        ) : (
          <ThangsModelDetails
            model={model}
            modelPath={modelPath}
            showOwner={showOwner}
            showSocial={showSocial}
            isLiked={isLiked}
            onReportModel={onReportModel}
            handleFindRelated={handleFindRelated}
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
  searchModelFileName,
}) => {
  const c = useStyles()
  const { reportModel, findRelated } = useContext(SearchActionContext)

  const currentUserId = parseInt(useCurrentUserId())
  const showOwner = withOwner && !!model.owner
  const isLiked = model && model.likes && model.likes.includes(currentUserId)
  // All text search results now have attributionUrl, regardless of scope.
  const modelAttributionUrl =
    model && model.attributionUrl && encodeURI(model.attributionUrl)
  // These variables are used for geo searches.
  // Could choose to go with attributionUrl for geo searches for simplicity.
  // BE to talk to RC & CC about this
  const modelIdPath = model.id ? `/model/${model.id}` : modelAttributionUrl
  const modelPath = model.identifier ? `/${model.identifier}` : modelIdPath
  return (
    <div
      className={classnames({
        [c.ModelSearchResult_ExternalLink]: model.scope !== 'thangs',
        [c.ModelSearchResult_ThangsLink]: model.scope === 'thangs',
      })}
    >
      <ResultContents
        className={className}
        model={model}
        showOwner={showOwner}
        showSocial={showSocial}
        isLiked={isLiked}
        modelAttributionUrl={modelAttributionUrl}
        searchModelFileName={searchModelFileName}
        modelPath={modelPath}
        onReportModel={reportModel}
        handleFindRelated={findRelated}
      />
    </div>
  )
}

export default ModelSearchResult
