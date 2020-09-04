import React from 'react'
import { ModelSearchResult } from '@components'

const ModelSearchResults = ({ items = [], ...props }) =>
  Array.isArray(items) &&
  items.map((model, index) => (
    <ModelSearchResult
      key={`model-${model.id}:${index}`}
      model={model}
      withOwner={true}
      {...props}
    />
  ))

export default ModelSearchResults
