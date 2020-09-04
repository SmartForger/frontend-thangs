import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { NoResults, Layout, Button } from '@components'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import { ReactComponent as FlagIcon } from '@svg/flag-icon.svg'
import ModelSearchResults from '@components/CardCollection/ModelSearchResults'
import { createUseStyles } from '@style'
import * as types from '@constants/storeEventTypes'

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
    SearchResults_Page: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    SearchResults_MainContent: {
      width: '100%',
    },
    SearchResults_MatchingIcon: {
      marginRight: '.5rem',
    },
    SearchResults_Header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      color: theme.colors.purple[900],
      marginBottom: '1.5rem',
    },
    SearchResults_HeaderTextWrapper: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    SearchResults_HeaderText: {
      ...theme.mixins.text.searchResultsHeader,
      fontSize: '1rem',
      lineHeight: '1.5rem',
      color: theme.colors.purple[900],
    },
    SearchResult_ResultCountText: {
      ...theme.mixins.text.searchResultsHeader,
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
      ...theme.mixins.text.searchResultsHeader,
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
  }
})

const SearchResult = ({
  models,
  modelId,
  isError,
  isLoading = true,
  c,
  searchModelFileName,
  showReportModel,
  handleReportModel,
  handleFindSimilar,
}) => {
  const filteredModels = models.filter(
    model => model.resultSource !== 'phyndexer' || model.attributionUrl
  )
  return (
    <div className={c.SearchResults_Results}>
      {modelId && (
        <div className={c.SearchResults_ResultsHeader}>
          <span className={c.SearchResults_ResultsHeaderText}>
            Similar geometry found elsewhere
          </span>
        </div>
      )}
      {isLoading ? (
        <NoResults>Searching our 1,000,000+ models...</NoResults>
      ) : isError ? (
        <NoResults>
          Error! We were not able to load results. Please try again later.
        </NoResults>
      ) : (
        <>
          {filteredModels && filteredModels.length > 0 ? (
            <ModelSearchResults
              items={filteredModels}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
              searchModelFileName={searchModelFileName}
              showReportModel={showReportModel}
              handleReportModel={handleReportModel}
              handleFindSimilar={handleFindSimilar}
            />
          ) : (
            <>
              {modelId ? (
                <NoResults>No results found. Try another search or model.</NoResults>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  )
}

const ThangsSearchResult = ({
  models,
  modelId,
  isError,
  isLoading = true,
  isOtherModelsLoaded,
  c,
  searchModelFileName,
  showReportModel,
  handleReportModel,
  handleFindSimilar,
}) => {
  const searchingText = useMemo(() => {
    return isOtherModelsLoaded
      ? `We are still searching the Thangs database, in the meantime - check out our
    public database search results below`
      : 'We are searching the Thangs database...'
  }, [isOtherModelsLoaded])
  return (
    <div className={c.SearchResults_Results}>
      {modelId && (
        <div className={c.SearchResults_ResultsHeader}>
          <UploadIcon className={classnames({ [c.Spinner]: isLoading })} />
          <span className={c.SearchResults_ResultsHeaderText}>
            Similar geometry on Thangs
          </span>
        </div>
      )}
      {isLoading ? (
        <>{modelId && <NoResults>{searchingText}</NoResults>}</>
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
              items={models}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
              searchModelFileName={searchModelFileName}
              showReportModel={showReportModel}
              handleReportModel={handleReportModel}
              handleFindSimilar={handleFindSimilar}
            />
          ) : (
            <>
              {modelId ? (
                <NoResults>No results found. Try another search or model.</NoResults>
              ) : null}
            </>
          )}
        </>
      )}
    </div>
  )
}

const useQuery = location => {
  return new URLSearchParams(location.search)
}

const Page = () => {
  const c = useStyles()
  const { searchQuery } = useParams()
  const location = useLocation()
  const query = useQuery(location)
  const modelId = useMemo(() => query.get('modelId'), [query])
  const { dispatch, searchResults } = useStoreon('searchResults')
  const { phyndexer, thangs } = searchResults
  const [showReportModelButtons, setShowReportModelButtons] = useState(false)
  useEffect(() => {
    if (!modelId) {
      dispatch(types.GET_TEXT_SEARCH_RESULTS, {
        searchTerm: searchQuery,
      })
    }
    if (modelId && modelId !== undefined) {
      dispatch(types.GET_RELATED_MODELS, {
        modelId: modelId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, modelId])

  const handleReportModel = useCallback(
    ({ model }) => {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'reportModel',
        overlayData: {
          model: model,
          afterSend: () => {
            setShowReportModelButtons(false)
            dispatch(types.CLOSE_OVERLAY)
          },
          onOverlayClose: () => {
            setShowReportModelButtons(false)
          },
        },
      })
    },
    [dispatch]
  )

  const handleFindSimilar = useCallback(
    ({ model }) => {
      dispatch(types.OPEN_OVERLAY, {
        overlayName: 'searchByUpload',
        overlayData: {
          model: model,
        },
      })
    },
    [dispatch]
  )

  const thangsModels = (thangs && thangs.data && thangs.data.matches) || []
  const phyndexerModels = (phyndexer && phyndexer.data && phyndexer.data.matches) || []
  const resultCount = phyndexerModels.length + thangsModels.length

  return (
    <div className={c.SearchResults_Page}>
      <div className={c.SearchResults_MainContent}>
        <div className={c.SearchResults_Header}>
          <div className={c.SearchResults_HeaderTextWrapper}>
            <div className={c.SearchResults_HeaderText}>
              Search Results for {decodeURIComponent(searchQuery)}
            </div>
            {resultCount && resultCount > 0 ? (
              <div className={c.SearchResult_ResultCountText}>
                About {resultCount} results
              </div>
            ) : null}
          </div>
          <div>
            <Link to='/'>
              <Button light small>
                Clear Search
              </Button>
            </Link>
          </div>
        </div>
        {searchQuery ? (
          <>
            <ThangsSearchResult
              isLoading={thangs.isLoading}
              isError={thangs.isError}
              models={thangsModels}
              modelId={modelId}
              searchModelFileName={undefined}
              isOtherModelsLoaded={phyndexer.isLoaded}
              showReportModel={showReportModelButtons}
              handleReportModel={handleReportModel}
              handleFindSimilar={handleFindSimilar}
              c={c}
            />
            <SearchResult
              isLoading={phyndexer.isLoading}
              isError={phyndexer.isError}
              models={phyndexerModels}
              modelId={modelId}
              searchModelFileName={undefined}
              showReportModel={showReportModelButtons}
              handleReportModel={handleReportModel}
              handleFindSimilar={handleFindSimilar}
              c={c}
            />
          </>
        ) : (
          <NoResults>
            Begin typing to search models by name, description, owner, etc. Use search by
            model to find geometrically related matches to the model you upload.
          </NoResults>
        )}
        {resultCount && resultCount > 0 ? (
          <Button
            text
            className={c.SearchResults_ReportModelButton}
            onClick={() => setShowReportModelButtons(!showReportModelButtons)}
          >
            <FlagIcon />
            Report a Model
          </Button>
        ) : null}
      </div>
    </div>
  )
}

const SearchResults = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}

export default SearchResults
