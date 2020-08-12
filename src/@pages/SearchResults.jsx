import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { CardCollection, NoResults, Layout, Button } from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'
import { useLocalStorage } from '@hooks'

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
  }
})

const SearchResult = ({ models, isLoading }) => {
  const c = useStyles()

  return (
    <div className={c.SearchResults}>
      <CardCollection
        loading={isLoading}
        noResultsText='No results found. Try searching another keyword or search by model above.'
      >
        <ModelCards models={models} />
      </CardCollection>
    </div>
  )
}

const Page = () => {
  const c = useStyles()
  const { searchQuery } = useParams()
  const { searchResults } = useStoreon('searchResults')
  const [savedSearchResults, setSavedSearchResults] = useLocalStorage(
    'savedSearchResults',
    null
  )

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
      {searchQuery ? (
        <SearchResult
          searchQuery={searchQuery}
          isLoading={searchResults.isLoading}
          models={savedSearchResults}
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
