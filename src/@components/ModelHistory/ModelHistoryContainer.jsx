import React from 'react'
import { useStoreon } from 'storeon/react'
import ModelHistory from './ModelHistory'

const ModelHistoryContainer = props => {
  const { dispatch, model, modelHistory } = useStoreon('model', 'modelHistory')
  const {
    data: modelData = {},
    isLoading: isLoadingModel,
    isError: isErrorModel,
    error: errorModel,
  } = model
  const { data = [], isLoading, isError, error } = modelHistory
  return (
    <ModelHistory
      {...props}
      modelHistory={data}
      modelData={modelData}
      dispatch={dispatch}
      isLoading={isLoading || isLoadingModel}
      isError={isError || isErrorModel}
      error={error || errorModel}
    />
  )
}

ModelHistoryContainer.displayName = 'ModelHistoryContainer'

export default ModelHistoryContainer
