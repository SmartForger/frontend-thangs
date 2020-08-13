import React, { useEffect, useMemo } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
import classnames from 'classnames'
import { useStoreon } from 'storeon/react'
import { CardCollection, NoResults, Layout, Button } from '@components'
import { ReactComponent as UploadIcon } from '@svg/icon-loader.svg'
import ModelCards from '@components/CardCollection/ModelCards'
import * as GraphqlService from '@services/graphql-service'
import { createUseStyles } from '@style'
import { useLocalStorage } from '@hooks'

const PROCESSING = 'PROCESSING'
const ERROR = 'ERROR'
const graphqlService = GraphqlService.getInstance()

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
  }
})

const SearchResult = ({
  models,
  modelId,
  isLoading,
  isError,
  c,
  searchModelFileName,
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
          noResultsText='No results found. Try searching another keyword or search by model above.'
        >
          <ModelCards
            models={models}
            showSocial={false}
            showWaldo={!!modelId}
            searchModelFileName={searchModelFileName}
          />
        </CardCollection>
      )}
    </div>
  )
}

const ThangsSearchResult = ({ modelId, c, searchModelFileName }) => {
  const {
    loading,
    error,
    model,
    startPolling,
    stopPolling,
  } = graphqlService.useUploadedModelByIdWithRelated(modelId)
  const isLoading = loading || (model && model.uploadStatus === PROCESSING)
  if (isLoading) {
    startPolling(1000)
  } else {
    stopPolling()
  }

  return (
    <div className={c.SearchResults_Results}>
      <div className={c.SearchResults_ResultsHeader}>
        <UploadIcon className={classnames({ [c.Spinner]: isLoading })} />
        <span className={c.SearchResults_ResultsHeaderText}>
          Similar geometry on Thangs
        </span>
      </div>
      {isLoading && <NoResults>Loading your results...</NoResults>}
      {error || !model || model.uploadStatus === ERROR ? (
        <NoResults>
          Error! We were not able to load results. Please try again later.
        </NoResults>
      ) : (
        <CardCollection
          loading={loading}
          noResultsText='No results found. Try searching another keyword or search by model above.'
        >
          <ModelCards
            models={model.relatedModels}
            showSocial={false}
            showWaldo={!!modelId}
            searchModelFileName={searchModelFileName}
          />
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    if (
      searchResults.data &&
      searchResults.data.matches &&
      Object.keys(searchResults.data.matches).length
    ) {
      setSavedSearchResults(searchResults.data.matches)
      setSavedSearchQuery(searchQuery)
      setSavedOriginalModelName(
        searchResults.data.searchModel ? searchResults.data.searchModel : null
      )
    }
  }, [
    modelId,
    searchQuery,
    searchResults,
    setSavedOriginalModelName,
    setSavedSearchQuery,
    setSavedSearchResults,
  ])

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
          modelId={modelId}
          c={c}
          searchModelFileName={
            searchResults && searchResults.data && searchResults.data.searchModel
          }
        />
      )}
      {searchQuery ? (
        <SearchResult
          searchQuery={searchQuery}
          isLoading={searchResults.isLoading}
          isError={searchResults.isError}
          models={savedSearchResults}
          modelId={modelId}
          searchModelFileName={savedOriginalModelName}
          c={c}
        />
      ) : (
        <NoResults>
          Begin typing to search models by name, description, owner, etc. Use search by
          model to find geometrically similar matches to the model you upload.
        </NoResults>
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
