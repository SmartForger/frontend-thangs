import React from 'react'

import * as GraphqlService from '@services/graphql-service'
import { NewInvertedHeaderLayout } from '@components/Layout'
import CardCollection from '@components/CardCollection'

const graphqlService = GraphqlService.getInstance()

function Page() {
  const { error, loading, models } = graphqlService.useModelsByLikes()

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
      loading={loading}
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
