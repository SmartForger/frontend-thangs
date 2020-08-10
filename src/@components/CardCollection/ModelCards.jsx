import React from 'react'
import ModelCard from '../ModelCard'

const ModelCards = ({ models = [], user, likes }) =>
  Array.isArray(models) &&
  models.map((model, index) => (
    <ModelCard
      key={`model-${model.id}:${index}`}
      model={model}
      withOwner={true}
      user={user}
      likes={likes}
    />
  ))

export default ModelCards
