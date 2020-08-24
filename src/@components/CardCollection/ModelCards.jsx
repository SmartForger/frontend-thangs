import React from 'react'
import ModelCard from '@components/ModelCard'

const ModelCards = ({ items = [], ...props }) =>
  Array.isArray(items) &&
  items.map((model, index) => (
    <ModelCard
      key={`model-${model.id}:${index}`}
      model={model}
      withOwner={true}
      {...props}
    />
  ))

export default ModelCards
