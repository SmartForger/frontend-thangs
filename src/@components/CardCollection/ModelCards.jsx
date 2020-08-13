import React from 'react'
import ModelCard from '@components/ModelCard'

const ModelCards = ({ models = [], user, likes, showSocial, showWaldo }) =>
  Array.isArray(models) &&
  models.map((model, index) => (
    <ModelCard
      key={`model-${model.id}:${index}`}
      model={model}
      withOwner={true}
      showSocial={showSocial}
      showWaldo={showWaldo}
      user={user}
      likes={likes}
    />
  ))

export default ModelCards
