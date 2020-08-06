import React from 'react'
import ModelCard from '../ModelCard'

const ModelCards = ({ models = [] }) =>
  Array.isArray(models) &&
  models.map((model, index) => (
    <ModelCard key={`model-${model.id}:${index}`} model={model} withOwner={true} />
  ))

export default ModelCards
