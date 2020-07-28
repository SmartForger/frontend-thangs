import React from 'react'

import * as GraphqlService from '@services/graphql-service'
import { NewInvertedHeaderLayout } from '@components/Layout'
import { Spinner } from '@components/Spinner'
import CardCollection from '@components/CardCollection'
import useFetchOnce from '../@services/store-service/hooks/useFetchOnce'

const graphqlService = GraphqlService.getInstance()

function Page() {
  const { error, loading, models } = graphqlService.useModelsByLikes()

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
    <CardCollection
      models={models}
      noResultsText='We have no models to display right now. Please try again later.'
    />
  )
}

export const Landing = () => {
  return (
    <NewInvertedHeaderLayout>
      <Page />
    </NewInvertedHeaderLayout>
  )
}
