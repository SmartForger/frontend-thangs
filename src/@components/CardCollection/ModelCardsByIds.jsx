import React from 'react'
import * as R from 'ramda'
import ModelCard from '../ModelCard'
import { useServices } from '@hooks'

const WithStoreModel = ({ id }) => {
  const { useFetchPerMount } = useServices()
  const { atom: { data: model } } = useFetchPerMount(id, 'model')

  return (
    !R.isNil(model) && !R.isEmpty(model)  && (
      <ModelCard model={model} withOwner={true} />
    )
  )
}

const ModelCardsByIds = ({ items = [] }) =>
  Array.isArray(items) &&
  items.map(modelId => {
    return <WithStoreModel key={modelId} id={modelId} />
  })

export default ModelCardsByIds
