import React from 'react'
import { useParams } from 'react-router-dom'
import { useLocalStorage } from '@hooks'
import * as GraphqlService from '@services/graphql-service'
import { ModelPreviewPage } from './ModelPreviewPage'
import { NewThemeLayout } from '@components/Layout'
import { Spinner } from '@components/Spinner'
import { Message404 } from '../404'

function Page() {
  const { id } = useParams()

  const graphqlService = GraphqlService.getInstance()
  const { loading, error, model } = graphqlService.useModelById(id)
  const [currentUser] = useLocalStorage('currentUser', null)

  if (loading) {
    return <Spinner />
  } else if (!model) {
    return <Message404 />
  } else if (error) {
    return <div>Error loading Model</div>
  }
  return <ModelPreviewPage model={model} currentUser={currentUser} />
}

const ModelPreview = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}

export { ModelPreview }
