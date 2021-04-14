import React from 'react'
import { useStoreon } from 'storeon/react'
import ModelInfoBox from './ModelInfoBox'

const ModelInfoBoxContainer = props => {
  const { dispatch, model } = useStoreon('model')
  const { data = [], isLoading, isError, error } = model
  return (
    <ModelInfoBox
      {...props}
      modelData={data}
      dispatch={dispatch}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  )
}

ModelInfoBoxContainer.displayName = 'ModelInfoBoxContainer'

export default ModelInfoBoxContainer
