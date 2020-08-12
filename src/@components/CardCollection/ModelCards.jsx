import React from 'react'
import ModelCard from '@components/ModelCard'

const ModelCards = ({ models = [], user, likes, showSocial }) =>
  Array.isArray(models) &&
  models.map((model, index) => (
    <ModelCard
      key={`model-${model.id}:${index}`}
      model={model}
      withOwner={true}
      showSocial={showSocial}
      user={user}
      likes={likes}
    />
  ))

export default ModelCards
