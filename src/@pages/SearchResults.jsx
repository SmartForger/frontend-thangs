import React, { useEffect } from 'react'
import * as R from 'ramda'
import { useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { CardCollection, NoResults, Layout } from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'

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
      // ...theme.mixins.text.subheaderText,
      // marginBottom: '1.5rem',
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
  const { dispatch, searchResults } = useStoreon('searchResults')

  useEffect(() => {
    if (R.empty(searchResults.data)) {
      dispatch('get-search-results', {
        searchTerm: searchQuery,
        onError: error => {
          console.log('e:', error)
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={c.SearchResults_Page}>
      <div className={c.SearchResults_Header}>
        <div className={c.SearchResults_HeaderText}>Search Results for {searchQuery}</div>
        {/* <div>
          <Button dark small>
            Clear Search
          </Button>
        </div> */}
      </div>
      {searchQuery ? (
        <SearchResult
          searchQuery={searchQuery}
          isLoading={searchResults.isLoading}
          models={searchResults.data}
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
