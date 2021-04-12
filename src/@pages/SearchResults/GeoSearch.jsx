import React, { useEffect, useMemo, useCallback } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import classnames from 'classnames'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'
import { NoResults } from '@components'
import { useQuery } from '@hooks'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import { ReactComponent as FromThangsLogo } from '@svg/fromThangs.svg'
import { ReactComponent as GlobeIcon } from '@svg/icon-globe.svg'
import ModelSearchResults from '@components/CardCollection/ModelSearchResults'
import { createUseStyles } from '@physna/voxel-ui/@style'
import * as types from '@constants/storeEventTypes'
import SearchHeader from './SearchHeader'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
    SearchResults_MatchingIcon: {
      marginRight: '.5rem',
    },
    SearchResults_FromThangsLogo: {
      height: '1rem',
      width: 'auto',
      marginLeft: '0.5rem',
      transform: 'translateY(3px)',

      '& path:last-child': {
        transform: 'translate(0, -12%)',
      },
    },
    SearchResult_ResultCountText: {
      ...theme.text.searchResultsHeader,
      fontSize: '.875rem',
      lineHeight: '1rem',
      color: theme.colors.grey[300],
    },
    SearchResults_BrandButton: {
      width: '100%',
    },
    SearchResults_SearchBar: {
      marginLeft: '.25rem',

      [md]: {
        marginLeft: '1rem',
        height: '100%',
      },
    },
    SearchResults_Results: {
      display: 'flex',
      flexDirection: 'column',
      margin: '1rem 0',
    },
    SearchResults_ResultsHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1.5rem',
      marginTop: '.5rem',
    },
    SearchResults_ResultsHeaderText: {
      ...theme.text.searchResultsHeader,
      marginLeft: '.5rem',
    },
    Spinner: {
      animation: '$spin 1.2s linear infinite',
    },
    SearchResults_ReportModelButton: {
      width: '12rem',
      marginTop: '2rem',
      alignSelf: 'flex-start',
      color: theme.colors.purple[400],

      '& > svg': {
        fill: theme.colors.purple[400],
        width: '.75rem',
      },
    },
    SearchResults_FilterBar: {
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
    },
  }
})
const noop = () => null
const SearchResult = ({
  onFindRelated,
  onReportModel,
  isError,
  isLoading = true,
  modelId,
  models,
  searchModelFileName,
}) => {
  const c = useStyles()
  const filteredModels =
    models && models.length
      ? models.filter(model => model.resultSource !== 'phyndexer' || model.attributionUrl)
      : []
  return (
    <div className={c.SearchResults_Results}>
      <div className={c.SearchResults_ResultsHeader}>
        <GlobeIcon />
        <span className={c.SearchResults_ResultsHeaderText}>
          {modelId ? 'Similar geometry found elsewhere' : 'Models found elsewhere'}
        </span>
      </div>
      {isLoading ? (
        <NoResults>Searching 1,000,000+ models...</NoResults>
      ) : isError ? (
        <NoResults>
          Error! We were not able to load results. Please try again later.
        </NoResults>
      ) : (
        <>
          {filteredModels && filteredModels.length > 0 ? (
            <ModelSearchResults
              handleFindRelated={onFindRelated}
              onReportModel={onReportModel}
              items={filteredModels}
              searchModelFileName={searchModelFileName}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
            />
          ) : null}
        </>
      )}
      {!isLoading && !isError && filteredModels.length === 0 ? (
        <NoResults>
          No results found. <b>Save your search</b> and we will notify you when there are
          matches.
        </NoResults>
      ) : null}
    </div>
  )
}

const ThangsSearchResult = ({
  onFindRelated,
  onReportModel,
  isError,
  isLoading = true,
  isOtherModelsLoaded,
  modelId,
  models,
  searchModelFileName,
}) => {
  const c = useStyles()
  const searchingText = useMemo(() => {
    return isOtherModelsLoaded
      ? `We are still searching the Thangs database, in the meantime - check out our
    public database search results below`
      : 'We are searching the Thangs database...'
  }, [isOtherModelsLoaded])
  return (
    <div className={c.SearchResults_Results}>
      <div className={c.SearchResults_ResultsHeader}>
        <UploadIcon className={classnames({ [c.Spinner]: isLoading })} />
        <span className={c.SearchResults_ResultsHeaderText}>
          {modelId ? 'Similar geometry' : 'Models'}
          <FromThangsLogo className={c.SearchResults_FromThangsLogo} />
        </span>
      </div>
      {isLoading ? (
        <NoResults>{searchingText}</NoResults>
      ) : isError ? (
        <>
          {modelId && (
            <NoResults>
              Error! We were not able to load results. Please try again later.
            </NoResults>
          )}
        </>
      ) : (
        <>
          {models && models.length > 0 ? (
            <ModelSearchResults
              handleFindRelated={onFindRelated}
              onReportModel={onReportModel}
              items={models}
              searchModelFileName={searchModelFileName}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
              showLoadMore={true}
            />
          ) : null}
        </>
      )}
      {!isLoading && !isError && models.length === 0 ? (
        <NoResults>
          No results found. <b>Save your search</b> and we will notify you when there are
          matches.
        </NoResults>
      ) : null}
    </div>
  )
}

const GeoSearchPage = ({ onFindRelated = noop, onReportModel = noop }) => {
  const FILTER_ALL = 'all'
  const FILTER_THANGS = 'thangs'
  const FILTER_PHYN = 'phyn'

  const filter = useQuery('filter') || FILTER_ALL
  const { searchQuery } = useParams()
  const modelId = useQuery('modelId')
  const phynId = useQuery('phynId')
  const related = useQuery('related')
  const { dispatch, geoSearchResults } = useStoreon('geoSearchResults')
  const history = useHistory()

  const { phyndexer, thangs } = geoSearchResults
  const thangsModels = R.path(['data'], thangs) || []
  const phyndexerModels = R.path(['data'], phyndexer) || []
  const resultCount = phyndexerModels.length + thangsModels.length
  const isLoading = useMemo(() => {
    if (filter === FILTER_ALL) {
      return thangs.isLoading || phyndexer.isLoading
    } else if (filter === FILTER_THANGS) {
      return thangs.isLoading
    } else {
      return phyndexer.isLoading
    }
  }, [filter, thangs.isLoading, phyndexer.isLoading])

  const setSearchFilters = useCallback(
    ({ scopeFilter }) => {
      if (scopeFilter !== filter) {
        history.push(
          `?modelId=${modelId}&phynId=${phynId}&related=${related}&filter=${scopeFilter}`
        )
      }
    },
    [modelId, phynId, related, filter, history]
  )

  useEffect(() => {
    dispatch(types.GET_RELATED_MODELS, {
      modelId: modelId,
      phyndexerId: phynId,
      geoSearch: !related,
      scope: filter,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, modelId, filter])

  return (
    <>
      {searchQuery && (
        <SearchHeader
          filter={filter}
          isLoading={isLoading}
          resultCount={resultCount}
          searchQuery={searchQuery}
          setFilters={setSearchFilters}
        />
      )}
      {searchQuery ? (
        <>
          {filter !== FILTER_PHYN && (modelId || phynId) ? (
            <ThangsSearchResult
              onFindRelated={onFindRelated}
              onReportModel={onReportModel}
              isError={thangs.isError}
              isLoading={thangs.isLoading}
              isOtherModelsLoaded={phyndexer.isLoaded}
              modelId={modelId}
              models={thangsModels}
              searchModelFileName={undefined}
            />
          ) : null}
          {phynId && filter !== FILTER_THANGS ? (
            <SearchResult
              onFindRelated={onFindRelated}
              onReportModel={onReportModel}
              isError={phyndexer.isError}
              isLoading={phyndexer.isLoading}
              modelId={modelId}
              models={phyndexerModels}
              searchModelFileName={undefined}
            />
          ) : null}
        </>
      ) : (
        <NoResults>
          Begin typing to search models by name, description, owner, etc. Use search by
          model to find geometrically related matches to the model you upload.
        </NoResults>
      )}
    </>
  )
}

export default GeoSearchPage
