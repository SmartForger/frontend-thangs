import React from 'react'
import ModelCard from '@components/ModelCard'

const ModelCards = ({
  models = [],
  user,
  likes,
  showSocial,
  showWaldo,
  showReportModel,
  searchModelFileName,
  handleReportModel,
}) =>
  Array.isArray(models) &&
  models.map((model, index) => (
    <ModelCard
      key={`model-${model.id}:${index}`}
      model={model}
      withOwner={true}
      searchModelFileName={searchModelFileName}
      showSocial={showSocial}
      showWaldo={showWaldo}
      showReportModel={showReportModel}
      handleReportModel={handleReportModel}
      user={user}
      likes={likes}
    />
  ))

export default ModelCards
