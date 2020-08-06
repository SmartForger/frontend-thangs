import React from 'react'
import * as R from 'ramda'
import ModelCard from '../ModelCard'
import { useServices } from '@hooks'

// TMP Delte after move to RestAPI
const parseStoreToGQL = data => ({
  ...data,
  likesCount: data.likes,
})

const WithStoreModel = ({ id }) => {
  const { useFetchOnce } = useServices()
  const { atom: model } = useFetchOnce(id, 'model')

  return (
    !R.isEmpty(model.data) && (
      <ModelCard model={parseStoreToGQL(model.data)} withOwner={true} />
    )
  )
}

const ModelCardsByIds = ({ modelsIds = [] }) =>
  Array.isArray(modelsIds) &&
  modelsIds.map(modelId => {
    return <WithStoreModel key={modelId} id={modelId} />
  })

export default ModelCardsByIds
