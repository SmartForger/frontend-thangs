import React, { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const RedirectModel = () => {
  const { modelId } = useParams()
  const { dispatch, model: modelAtom = {} } = useStoreon('model')
  const { data: modelData, isError } = modelAtom

  useEffect(() => {
    dispatch(types.FETCH_MODEL, { id: modelId })
  }, [dispatch, modelId])
  debugger
  if (isError) return <Redirect to={'/'} />
  if (modelData && modelData.identifier)
    return <Redirect to={`/${modelData.identifier}`} />
  return null
}

export default RedirectModel
