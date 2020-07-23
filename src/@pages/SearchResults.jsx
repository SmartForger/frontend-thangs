import React from 'react'
import { WithNewThemeLayout } from '@style'
import { useParams, Link } from 'react-router-dom'
import * as GraphqlService from '@services/graphql-service'
import { Spinner } from '@components/Spinner'
import CardCollection from '@components/CardCollection'
import { Button } from '../@components/Button'
import { SearchBar } from '@components/SearchBar'
import { NoResults } from '../@components/NoResults'
import { subheaderText } from '@style/text'
import { ReactComponent as MatchingIcon } from '../@svg/matching-icon.svg'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    SearchResults: {
      marginTop: '2rem',
    },
    SearchResults_MatchingIcon: {
      marginRight: '.5rem',
    },
    SearchResults_Header: {
      ...subheaderText,
      marginBottom: '1.5rem',
    },
    SearchResults_Flexbox: {
      display: 'flex',
      marginBottom: '3rem',
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

function Matching() {
  const c = useStyles()
  return (
    <Link to={'/matching'}>
      <Button brand className={c.SearchResults_BrandButton}>
        <MatchingIcon className={c.SearchResults_MatchingIcon} />
        <span>Search by Model</span>
      </Button>
    </Link>
  )
}

const SearchResult = ({ searchQuery }) => {
  const c = useStyles()
  const graphqlService = GraphqlService.getInstance()
  const { loading, error, models } = graphqlService.useSearchModels(searchQuery)

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <SearchResults className={c.SearchResults}>
      <div className={c.SearchResults_Header}>Results for {searchQuery}</div>
      <CardCollection
        models={models}
        noResultsText='No results found. Try searching another keyword or search by model above.'
      />
    </SearchResults>
  )
}

const Page = () => {
  const c = useStyles()
  const { searchQuery } = useParams()
  return (
    <>
      <div className={c.SearchResults_Flexbox}>
        <Matching />
        <SearchBar
          className={c.SearchResults_SearchBar}
          initialSearchQuery={searchQuery}
        />
      </div>
      {searchQuery ? (
        <SearchResult searchQuery={searchQuery} />
      ) : (
        <NoResults>
          Begin typing to search models by name, description, owner, etc. Use search by
          model to find geometrically similar matches to the model you upload.
        </NoResults>
      )}
    </>
  )
}

export const SearchResults = WithNewThemeLayout(Page)
