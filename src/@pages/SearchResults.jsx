import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { CardCollection, NoResults, Layout, Button } from '@components'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import { ReactComponent as FlagIcon } from '@svg/flag-icon.svg'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'
import { useLocalStorage } from '@hooks'

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
    SearchResults: {
      marginTop: '2rem',
    },
    SearchResults_Page: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    },
    SearchResults_MatchingIcon: {
      marginRight: '.5rem',
    },
    SearchResults_Header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    SearchResults_HeaderText: {
      ...theme.mixins.text.searchResultsHeader,
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
      marginTop: '2rem',
    },
    SearchResults_ResultsHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
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
      marginTop: '4rem',
      alignSelf: 'flex-end',
    },
  }
})

const SearchResult = ({
  models,
  modelId,
  isLoading,
  isError,
  c,
  searchModelFileName,
  showReportModel,
  handleReportModel,
}) => {
  return (
    <div className={c.SearchResults_Results}>
      {modelId && (
        <div className={c.SearchResults_ResultsHeader}>
          <span className={c.SearchResults_ResultsHeaderText}>
            Similar geometry found elsewhere
          </span>
        </div>
      )}
      {isError ? (
        <NoResults>
          Error! We were not able to load results. Please try again later.
        </NoResults>
      ) : (
        <CardCollection
          loading={isLoading}
          noResultsText='No results found. Try searching another keyword or model above.'
        >
          {models ? (
            <ModelCards
              items={models}
              showSocial={false}
              showWaldo={false} //Change back to !!modelId when we want waldo thumbnails back
              searchModelFileName={searchModelFileName}
              showReportModel={showReportModel}
              handleReportModel={handleReportModel}
              isExternalModel={!!modelId}
            />
          ) : null}
        </CardCollection>
      )}
    </div>
  )
}

const ThangsSearchResult = ({
  models,
  isError,
  isLoading,
  isOtherModelsLoaded,
  c,
  searchModelFileName,
  showReportModel,
  handleReportModel,
}) => {
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
          Similar geometry on Thangs
        </span>
      </div>
      {isLoading ? (
        <NoResults>{searchingText}</NoResults>
      ) : isError ? (
        <NoResults>
          Error! We were not able to load results. Please try again later.
        </NoResults>
      ) : (
        <CardCollection
          loading={isLoading}
          noResultsText='No results found. Try searching another keyword or model above.'
        >
          {models ? (
            <ModelCards
              items={models}
              showSocial={false}
              showWaldo={false} //Change back to TRUE when we want waldo thumbnails back
              searchModelFileName={searchModelFileName}
              showReportModel={showReportModel}
              handleReportModel={handleReportModel}
            />
          ) : null}
        </CardCollection>
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
  const { text, phyndexer, thangs } = searchResults
  const [savedSearchResults, setSavedSearchResults] = useLocalStorage(
    'savedSearchResults',
    null
  )
  const [savedSearchQuery, setSavedSearchQuery] = useLocalStorage(
    'savedSearchQuery',
    null
  )
  const [savedOriginalModelName, setSavedOriginalModelName] = useLocalStorage(
    'savedOriginalModelName',
    null
  )
  const [showReportModelButtons, setShowReportModelButtons] = useState(false)
  useEffect(() => {
    if (savedSearchQuery !== searchQuery || !savedSearchResults) {
      dispatch('reset-search-results')
      setSavedSearchResults(null)
      setSavedSearchQuery(null)
      setSavedOriginalModelName(null)
      if (!modelId) {
        dispatch('get-search-results-by-text', {
          searchTerm: searchQuery,
        })
      }
    }
    if (modelId && modelId !== 'undefined')
      dispatch('get-related-models-via-thangs', { modelId: modelId })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    if (!modelId) {
      if (
        text &&
        text.data &&
        text.data.matches &&
        Object.keys(text.data.matches).length
      ) {
        setSavedSearchResults(text.data.matches)
        setSavedSearchQuery(searchQuery)
        setSavedOriginalModelName(null)
      }
    } else {
      if (
        phyndexer &&
        phyndexer.data &&
        phyndexer.data.matches &&
        Object.keys(phyndexer.data.matches).length
      ) {
        setSavedSearchResults(phyndexer.data.matches)
        setSavedSearchQuery(searchQuery)
        setSavedOriginalModelName(phyndexer.data.searchByModelFileName)
      }
    }
  }, [
    modelId,
    phyndexer,
    searchQuery,
    searchResults,
    setSavedOriginalModelName,
    setSavedSearchQuery,
    setSavedSearchResults,
    text,
  ])

  const handleReportModel = useCallback(
    ({ model }) => {
      dispatch('open-modal', {
        modalName: 'reportModel',
        modalData: {
          model: model,
          afterSend: () => {
            setShowReportModelButtons(false)
            dispatch('close-modal')
          },
          onModalClose: () => {
            setShowReportModelButtons(false)
          },
        },
      })
    },
    [dispatch]
  )

  return (
    <div className={c.SearchResults_Page}>
      <div className={c.SearchResults_Header}>
        <div className={c.SearchResults_HeaderText}>Search Results for {searchQuery}</div>
        <div>
          <Link to='/'>
            <Button light small>
              Clear Search
            </Button>
          </Link>
        </div>
      </div>
      {modelId && (
        <ThangsSearchResult
          models={thangs && thangs.data}
          isLoading={thangs && thangs.isLoading}
          isError={thangs && thangs.isError}
          c={c}
          searchModelFileName={savedOriginalModelName}
          isOtherModelsLoaded={savedSearchResults && savedSearchResults.length > 0}
          showReportModel={showReportModelButtons}
          handleReportModel={handleReportModel}
        />
      )}
      {searchQuery ? (
        <SearchResult
          searchQuery={searchQuery}
          isLoading={modelId ? phyndexer.isLoading : text.isLoading}
          isError={modelId ? phyndexer.isError : text.isError}
          models={savedSearchResults}
          modelId={modelId}
          searchModelFileName={savedOriginalModelName}
          showReportModel={showReportModelButtons}
          handleReportModel={handleReportModel}
          c={c}
        />
      ) : (
        <NoResults>
          Begin typing to search models by name, description, owner, etc. Use search by
          model to find geometrically similar matches to the model you upload.
        </NoResults>
      )}
      {savedSearchResults && (
        <Button
          className={c.SearchResults_ReportModelButton}
          onClick={() => setShowReportModelButtons(!showReportModelButtons)}
        >
          <FlagIcon />
          Report a Model
        </Button>
      )}
    </div>
  )
}

export const SearchResults = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
