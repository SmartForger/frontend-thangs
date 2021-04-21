import React, { useContext } from 'react'
import classnames from 'classnames'
import Skeleton from '@material-ui/lab/Skeleton'

import { createUseStyles } from '@physna/voxel-ui/@style'

import {
  Card,
  ContainerRow,
  ModelThumbnail,
  NoResults,
  PartThumbnailList,
  ProfilePicture,
  SearchAnchor,
  SearchResultDetailsMenu,
  SearchResultFooter,
  Spacer,
} from '@components'
import { numberWithCommas, truncateString, getExternalAvatar } from '@utilities'
import { SearchActionContext } from '@pages/SearchResults/SearchActions'

import { ReactComponent as ExternalLinkIcon } from '@svg/external-link.svg'

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
      flexDirection: 'column',
      flexGrow: 1,
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
      color: theme.colors.grey[700],
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: '1.5rem',
      marginTop: '.25rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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

const ModelDetails = ({
  isExternalModel,
  model = {},
  onThangsClick = noop,
  scope,
  searchIndex,
}) => {
  const c = useStyles()
  const { reportModel, findRelated } = useContext(SearchActionContext)

  const {
    attributionUrl,
    modelTitle,
    modelDescription,
    modelFileName,
    ownerAvatarUrl,
    ownerUsername,
    parts,
  } = model
  let formattedModelDescription = truncateString(modelDescription, 144)

  return (
    <div className={c.TextSearchResult_Content}>
      <div className={c.TextSearchResult_Attribution}>
        <SearchAnchor
          to={{
            pathname: attributionUrl,
            state: { prevPath: window.location.href },
          }}
          isExternal={isExternalModel}
          scope={scope}
          onThangsClick={onThangsClick}
          searchIndex={searchIndex}
        >
          <ContainerRow alignItems='center'>
            {attributionUrl && (
              <>
                <ProfilePicture
                  size='1.25rem'
                  name={ownerUsername}
                  src={ownerAvatarUrl || getExternalAvatar(attributionUrl)}
                />
                <Spacer size='.25rem' />
              </>
            )}
            <span className={c.TextSearchResult_ExternalUrl} title={model.attributionUrl}>
              {(ownerUsername && ownerUsername.split('@')[0]) || model.attributionUrl}
            </span>
            {isExternalModel && (
              <>
                <Spacer size={'.25rem'}></Spacer>
                <ExternalLinkIcon />
              </>
            )}
          </ContainerRow>
        </SearchAnchor>
        <SearchResultDetailsMenu model={model} onReportModel={reportModel} />
      </div>
      <SearchAnchor
        to={{
          pathname: attributionUrl,
          state: { prevPath: window.location.href },
        }}
        isExternal={isExternalModel}
        scope={scope}
        onThangsClick={onThangsClick}
      >
        <div className={c.TextSearchResult_Name}>{modelTitle || modelFileName}</div>
        <div className={c.TextSearchResult_Description}>{formattedModelDescription}</div>
      </SearchAnchor>
      {parts && parts.length > 0 && (
        <>
          <Spacer size={'1rem'} />
          <PartThumbnailList
            isExternalModel={isExternalModel}
            onThangsClick={onThangsClick}
            parts={parts}
            scope={scope}
            searchIndex={searchIndex}
          />
        </>
      )}
      <Spacer size={'1rem'} />
      <SearchResultFooter model={model} onFindRelated={findRelated} />
    </div>
  )
}

const TextSearchResult = ({
  model,
  onThangsClick = noop,
  scope,
  searchIndex,
  spotCheckRef,
  firstCardRef,
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
      ref={firstCardRef ?? spotCheckRef}
    >
      <div className={c.TextSearchResult_ResultContents}>
        <SearchAnchor
          to={{
            pathname: modelAttributionUrl,
            search: model?.parts?.length > 0 ? `?part=${model.modelId}` : null,
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
        </SearchAnchor>
        <div className={c.TextSearchResult_Column}>
          <ModelDetails
            model={model}
            onThangsClick={onThangsClick}
            isExternalModel={isExternalModel}
            scope={scope}
            searchIndex={searchIndex}
          />
        </div>
      </div>
    </div>
  )
}

const TextSearchResults = ({
  isError,
  isLoading,
  items,
  onThangsClick,
  searchScope: scope,
  searchTerm,
  spotCheckRef,
  spotCheckIndex,
  firstCardRef,
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
  if (!isLoading && !items.length) {
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
      onThangsClick={onThangsClick}
      scope={scope}
      searchIndex={ind}
      spotCheckRef={spotCheckIndex === ind ? spotCheckRef : undefined}
      firstCardRef={ind === 0 ? firstCardRef : undefined}
    />
  ))
  if (isLoading) {
    results.push(
      ...[...Array(10).keys()].map(key => {
        return (
          <React.Fragment key={`skeletonSearchCard-${key}`}>
            <div className={c.TextSearchResult_Skeleton_Row}>
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
          </React.Fragment>
        )
      })
    )
  }

  return results
}

export default TextSearchResults
