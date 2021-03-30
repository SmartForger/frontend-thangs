import React from 'react'
import { useStoreon } from 'storeon/react'
import ModelHistory from './ModelHistory'

const ModelHistoryContainer = props => {
  const { dispatch, modelHistory } = useStoreon('modelHistory')
  const { data = [], isLoading, isError, error } = modelHistory
  return (
    <ModelHistory
      {...props}
      modelHistory={data}
      dispatch={dispatch}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  )
}

ModelHistoryContainer.displayName = 'ModelHistoryContainer'

export default ModelHistoryContainer
