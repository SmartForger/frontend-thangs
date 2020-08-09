import React from 'react'
import { useParams, Link } from 'react-router-dom'
import * as GraphqlService from '@services/graphql-service'
import {
  Spinner,
  CardCollection,
  Button,
  SearchBar,
  NoResults,
  Layout,
} from '@components'
import ModelCards from '@components/CardCollection/ModelCards'
import { ReactComponent as MatchingIcon } from '@svg/matching-icon.svg'
import { createUseStyles } from '@style'

const graphqlService = GraphqlService.getInstance()

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
      ...theme.mixins.text.subheaderText,
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

const Matching = () => {
  const c = useStyles()
  return (
    <Link to={'/matching'}>
      <Button className={c.SearchResults_BrandButton}>
        <MatchingIcon className={c.SearchResults_MatchingIcon} />
        <span>Search by Model Upload</span>
      </Button>
    </Link>
  )
}

const SearchResult = ({ searchQuery }) => {
  const c = useStyles()
  const { loading, error, models } = graphqlService.useSearchModels(searchQuery)

  if (loading) {
    return <Spinner />
  }

  if (!models && error) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <div className={c.SearchResults}>
      <div className={c.SearchResults_Header}>Results for {searchQuery}</div>
      <CardCollection noResultsText='No results found. Try searching another keyword or search by model above.'>
        <ModelCards models={models} />
      </CardCollection>
    </div>
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

export const SearchResults = () => {
  return (
    <Layout>
      <Page />
    </Layout>
  )
}
