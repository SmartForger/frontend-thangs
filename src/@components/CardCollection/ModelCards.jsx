import React from 'react'
import { ModelCard } from '@components'

const ModelCards = ({ items = [], ...props }) =>
  Array.isArray(items) &&
  items.map((model, index) => (
    <ModelCard key={`model-${model.id}:${index}`} model={model} {...props} />
  ))

export default ModelCards
