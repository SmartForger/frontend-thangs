import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as ExternalLinkIcon } from '@svg/external-link.svg'
import {
  Card,
  ModelThumbnail,
  NoResults,
  ProfilePicture,
  Spacer,
  PartThumbnailList,
} from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { numberWithCommas, truncateString, getExternalAvatar } from '@utilities'
import { track } from '@utilities/analytics'
import Skeleton from '@material-ui/lab/Skeleton'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme

  return {
    TextSearchResult: {},
    TextSearchResult_ThumbnailWrapper: {
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
    TextSearchResult_Thumbnail: {
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
    TextSearchResult_ResultContents: {
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '1.5rem',

      [md]: {
        flexDirection: 'row',
      },
    },
    TextSearchResult_Column: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    TextSearchResult_Content: {
      padding: '.5rem 0',
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',
    },
    TextSearchResult_UserDetails: {
      display: 'flex',
    },
    TextSearchResult_Name: {
      fontSize: '1.125rem',
      lineHeight: '1.125rem',
      fontWeight: '600',
      marginTop: '.5rem',
      color: theme.colors.purple[900],
    },
    TextSearchResult_Description: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: '500',
      marginTop: '.25rem',
      color: theme.colors.grey[700],
    },
    TextSearchResult_DetailsInline: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    TextSearchResult_Attribution: {
      display: 'flex',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',

      '& > div': {
        display: 'flex',
        alignItems: 'center',
      },
    },
    TextSearchResult_ExternalUrl: {
      flexGrow: 1,
      fontSize: '.75rem',
      fontWeight: '600',
      color: theme.colors.grey[300],
      overflow: 'hidden',
    },
    TextSearchResult_Row: {
      display: 'flex',
      justifyContent: 'space-between',
      marginLeft: '.5rem',
    },
    TextSearchResult_ActivityIndicators: {
      display: 'flex',
      flexDirection: 'row',

      '& > span:not(:last-child)': {
        marginRight: '1rem',
      },
    },
    TextSearchResult_ActivityCount: {
      ...theme.text.thumbnailActivityCountText,
      display: 'flex',
      alignItems: 'center',
      letterSpacing: 0,

      '& svg': {
        marginRight: '.25rem',
      },
    },
    TextSearchResult_Icon: {
      '& path': {
        fill: theme.colors.grey[300],
      },
    },
    TextSearchResult_Icon__liked: {
      '& path': {
        fill: theme.colors.gold[500],
      },
    },
    TextSearchResult_ExternalLink: {
      zIndex: '1',
    },
    TextSearchResult_ThangsLink: {
      zIndex: '1',
    },
    TextSearchResult_ReportModelButton: {
      '& > svg': {
        margin: '0 !important',
      },
    },
    TextSearchResult_FindRelatedLink: {
      marginTop: '1rem',
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1rem',
      cursor: 'pointer',
      textDecoration: 'underline',
    },
    TextSearchResult_ReportModelLink: {
      fontSize: '.75rem',
      fontWeight: '500',
      cursor: 'pointer',

      '&:hover': {
        textDecoration: 'underline',
      },
    },
    TextSearchResult_Thumbnail_Skeleton: {
      width: '100%',
      height: '16.375rem !important',
      margin: 'auto',
      borderRadius: '.5rem',

      [md]: {
        height: '100% !important',
        width: '16.375rem',
      },
    },
    TextSearchResult_Text_Skeleton: {
      height: '1rem !important',
      width: '100%',
      margin: 'auto',
      borderRadius: '.5rem',
      paddingBottom: '1rem',
    },
    TextSearchResult_Title_Skeleton: {
      height: '5rem',
      width: '100%',
      margin: 'auto',
      borderRadius: '.5rem',
      paddingBottom: '1rem',
    },
    TextSearchResult_Subtext_Skeleton: {
      height: '5rem !important',
      width: '100%',
      margin: 'auto',
      borderRadius: '.5rem',
      paddingBottom: '1rem',
    },
    TextSearchResult_Skeleton_Row: {
      display: 'flex',
      flexDirection: 'column',
      height: '16.375rem',
      width: '100%',

      [md]: {
        flexDirection: 'row',
      },
    },
    TextSearchResult_Skeleton_Column: {
      display: 'none',

      [md]: {
        display: 'flex',
        flexDirection: 'column',
        width: '50%',
      },
    },
  }
})

const noop = () => null

const Anchor = ({
  children,
  to = {},
  isExternal,
  scope,
  searchIndex,
  onThangsClick = noop,
  ...props
}) => {
  const onClick = useCallback(() => {
    if (isExternal) {
      track('External Model Link', {
        path: to.pathname,
        type: 'text',
        scope,
        searchIndex,
      })
    } else {
      onThangsClick(searchIndex)
      track('Thangs Model Link', { path: to.pathname, type: 'text', scope, searchIndex })
    }
  }, [isExternal, onThangsClick, scope, searchIndex, to.pathname])
  if (!to.pathname) return children
  const thangsPath = !isExternal ? to.pathname.split('.com').pop() : to.pathname
  return isExternal ? (
    <a
      href={encodeURI(thangsPath)}
      target='_blank'
      rel='noopener noreferrer'
      onClick={onClick}
      {...props}
    >
      {children}
    </a>
  ) : (
    <Link to={encodeURI(thangsPath)} onClick={onClick} {...props}>
      {children}
    </Link>
  )
}

// function generateTestParts(model) {
//   const partCount = Math.random() > 0.5 ? Math.floor(Math.random() * 100) : 0
//   const parts = []

//   for (let i = 0; i < partCount; i++) {
//     parts.push(model)
//   }

//   return parts
// }

const ModelDetails = ({
  isExternalModel,
  model = {},
  onFindRelated = noop,
  onThangsClick = noop,
  scope,
}) => {
  const c = useStyles()
  const {
    attributionUrl,
    modelTitle,
    modelDescription,
    modelFileName,
    ownerFirstName,
    ownerLastName,
    ownerAvatarUrl,
    ownerUsername,
    parts,
  } = model
  let formattedModelDescription = truncateString(modelDescription, 144)

  return (
    <div className={c.TextSearchResult_Content}>
      <Anchor
        to={{
          pathname: attributionUrl,
          state: { prevPath: window.location.href },
        }}
        isExternal={isExternalModel}
        scope={scope}
        onThangsClick={onThangsClick}
      >
        <div className={c.TextSearchResult_Attribution}>
          <div>
            {attributionUrl && (
              <>
                <ProfilePicture
                  size='1.25rem'
                  name={`${ownerFirstName} ${ownerLastName}`}
                  src={ownerAvatarUrl || getExternalAvatar(attributionUrl)}
                />
                <Spacer size='.25rem' />
              </>
            )}
            <span className={c.TextSearchResult_ExternalUrl} title={model.attributionUrl}>
              {(ownerUsername && ownerUsername.split('@')[0]) || model.attributionUrl}
            </span>
          </div>
          {isExternalModel && <ExternalLinkIcon />}
        </div>
        <div className={c.TextSearchResult_Name}>{modelTitle || modelFileName}</div>
        <div className={c.TextSearchResult_Description}>{formattedModelDescription}</div>
        {parts && parts.length > 0 && (
          <>
            <Spacer size={'1rem'} />
            <PartThumbnailList parts={parts} />
          </>
        )}
      </Anchor>
      <div
        className={c.TextSearchResult_FindRelatedLink}
        onClick={() => onFindRelated({ model })}
      >
        View related models
      </div>
    </div>
  )
}

const TextSearchResult = ({
  model,
  onThangsClick = noop,
  onFindRelated = noop,
  onReportModel = noop,
  scope,
  searchIndex,
  spotCheckRef,
}) => {
  const c = useStyles()

  const modelAttributionUrl = model && model.attributionUrl
  const isExternalModel = !model.scope.includes('thangs')

  if (!modelAttributionUrl) return null
  return (
    <div
      className={classnames({
        [c.TextSearchResult_ExternalLink]: isExternalModel,
        [c.TextSearchResult_ThangsLink]: !isExternalModel,
      })}
      ref={spotCheckRef}
    >
      <div className={c.TextSearchResult_ResultContents}>
        <Anchor
          to={{
            pathname: modelAttributionUrl,
            state: { prevPath: window.location.href },
          }}
          isExternal={isExternalModel}
          scope={scope}
          searchIndex={searchIndex}
          onThangsClick={onThangsClick}
        >
          <Card className={c.TextSearchResult_ThumbnailWrapper}>
            <ModelThumbnail
              className={c.TextSearchResult_Thumbnail}
              name={model.name}
              model={model}
            />
          </Card>
        </Anchor>
        <div className={c.TextSearchResult_Column}>
          <ModelDetails
            model={model}
            onThangsClick={onThangsClick}
            onReportModel={onReportModel}
            onFindRelated={onFindRelated}
            isExternalModel={isExternalModel}
            scope={scope}
          />
          <div
            className={c.TextSearchResult_ReportModelLink}
            onClick={() => onReportModel({ model })}
          >
            Report Model
          </div>
        </div>
      </div>
    </div>
  )
}

const TextSearchResults = ({
  isError,
  isLoaded,
  isLoading,
  items,
  onThangsClick,
  onFindRelated,
  onReportModel,
  searchScope: scope,
  searchTerm,
  spotCheckRef,
  spotCheckIndex,
  totalModelCount,
}) => {
  const c = useStyles()
  let results = []
  if (isError) {
    return (
      <NoResults>Error! We were not able to load results. Please try again.</NoResults>
    )
  }
  if (isLoading && !items.length) {
    const loadingText = `Searching ${
      numberWithCommas(totalModelCount) || '1,500,000'
    } models to find the best results
    for ${searchTerm}`
    return <NoResults>{loadingText}</NoResults>
  }
  if (isLoaded && !items.length) {
    return (
      <NoResults>
        No results found. <b>Save your search</b> and we will notify you when there are
        matches.
      </NoResults>
    )
  }
  results = items.map((item, ind) => (
    <TextSearchResult
      key={`textResult_${ind}`}
      model={item}
      onFindRelated={onFindRelated}
      onReportModel={onReportModel}
      onThangsClick={onThangsClick}
      scope={scope}
      searchIndex={ind}
      spotCheckRef={spotCheckIndex === ind ? spotCheckRef : undefined}
    />
  ))
  if (isLoading) {
    results.push(
      ...[...Array(10).keys()].map(key => {
        return (
          <>
            <div
              className={c.TextSearchResult_Skeleton_Row}
              key={`skeletonSearchCard-${key}`}
            >
              <div>
                <Skeleton
                  variant='rect'
                  className={c.TextSearchResult_Thumbnail_Skeleton}
                />
              </div>
              <Spacer size={'1.5rem'} />
              <div className={c.TextSearchResult_Skeleton_Column}>
                <div>
                  <Skeleton variant='rect' className={c.TextSearchResult_Text_Skeleton} />
                </div>
                <Spacer size={'.5rem'} />
                <div>
                  <Skeleton
                    variant='rect'
                    className={c.TextSearchResult_Title_Skeleton}
                  />
                </div>
                <Spacer size={'.5rem'} />
                <div>
                  <Skeleton
                    variant='rect'
                    className={c.TextSearchResult_Subtext_Skeleton}
                  />
                </div>
              </div>
            </div>
            <Spacer size={'1.5rem'} />
          </>
        )
      })
    )
  }

  return results
}

export default TextSearchResults
