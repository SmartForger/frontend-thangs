import React from 'react'
import { useStoreon } from 'storeon/react'
import ModelStatBar from './ModelStatBar'

const ModelStatBarContainer = props => {
  const { dispatch, model } = useStoreon('model')
  const { data = [], isLoading, isError, error } = model
  return (
    <ModelStatBar
      {...props}
      modelData={data}
      dispatch={dispatch}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  )
}

ModelStatBarContainer.displayName = 'ModelStatBarContainer'

export default ModelStatBarContainer
