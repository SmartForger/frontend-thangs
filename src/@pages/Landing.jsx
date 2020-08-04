import React, { useEffect } from 'react'
import { NewInvertedHeaderLayout } from '@components/Layout'
import CardCollection from '@components/CardCollection'
import { useStoreon } from 'storeon/react'

function Page() {
  const { dispatch, modelPreviews } = useStoreon('modelPreviews')

  useEffect(() => {
    dispatch('fetch-model-previews')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (modelPreviews.isError) {
    return (
      <div data-cy='fetch-results-error'>
        Error! We were not able to load results. Please try again later.
      </div>
    )
  }

  return (
    <CardCollection
      models={modelPreviews.data}
      noResultsText='We have no models to display right now. Please try again later.'
      loading={modelPreviews.isLoading}
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
