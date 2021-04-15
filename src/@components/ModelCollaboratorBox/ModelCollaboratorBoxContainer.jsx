import React from 'react'
import { useStoreon } from 'storeon/react'
import ModelCollaboratorBox from './ModelCollaboratorBox'

const ModelCollaboratorBoxContainer = props => {
  const { dispatch, model } = useStoreon('model')
  const { data = [], isLoading, isError, error } = model
  return (
    <ModelCollaboratorBox
      {...props}
      modelData={data}
      dispatch={dispatch}
      isLoading={isLoading}
      isError={isError}
      error={error}
    />
  )
}

ModelCollaboratorBoxContainer.displayName = 'ModelCollaboratorBoxContainer'

export default ModelCollaboratorBoxContainer
