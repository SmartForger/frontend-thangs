import React from 'react'
import ModelCard from '../ModelCard'
import useFetchOnce from '@services/store-service/hooks/useFetchOnce'

const WithStoreModel = ({ id }) => {
  const { atom: model } = useFetchOnce(id, 'model')

  return <ModelCard model={model.data} withOwner={true} />
}

const ModelCardsByIds = ({ modelsIds = [] }) =>
  Array.isArray(modelsIds) &&
  modelsIds.map(modelId => {
    return <WithStoreModel key={modelId} id={modelId} />
  })

export default ModelCardsByIds
