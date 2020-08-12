import React, { useEffect, useMemo } from 'react'
import { useLocation, useParams, Link } from 'react-router-dom'
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
    },
    SearchResults_ResultsHeaderText: {
      ...theme.mixins.text.searchResultsHeader,
      marginLeft: '.5rem',
    },
  }
})

const SearchResult = ({ models, modelId, isLoading, isError, c }) => {
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
          <ModelCards models={models} showSocial={false} />
        </CardCollection>
      )}
    </div>
  )
}

const ThangsSearchResult = ({ modelId, c }) => {
  const {
    loading,
    error,
    model,
    startPolling,
    stopPolling,
  } = graphqlService.useUploadedModelByIdWithRelated(modelId)

  if (loading || (model && model.uploadStatus === PROCESSING)) {
    startPolling(1000)
  }

  stopPolling()

  return (
    <div className={c.SearchResults_Results}>
      <div className={c.SearchResults_ResultsHeader}>
        <UploadIcon />
        <span className={c.SearchResults_ResultsHeaderText}>
          Similar geometry on Thangs
        </span>
      </div>
      {error || !model || model.uploadStatus === ERROR ? (
        <NoResults>
          Error! We were not able to load results. Please try again later.
        </NoResults>
      ) : (
        <CardCollection
          loading={loading}
          noResultsText='No results found. Try searching another keyword or search by model above.'
        >
          <ModelCards models={model} showSocial={false} />
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
  useEffect(() => {
    if (!modelId) {
      dispatch('get-search-results-by-text', {
        searchTerm: searchQuery,
        onFinish: _results => {},
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (searchResults.data && Object.keys(searchResults.data).length) {
      setSavedSearchResults(searchResults.data)
    }
  }, [searchResults, setSavedSearchResults])

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
      {modelId && <ThangsSearchResult modelId={modelId} c={c} />}
      {searchQuery ? (
        <SearchResult
          searchQuery={searchQuery}
          isLoading={searchResults.isLoading}
          isError={searchResults.isError}
          models={savedSearchResults}
          modelId={modelId}
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
