import React, { useEffect, useState } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const RedirectModel = () => {
  const { modelId } = useParams()
  const { dispatch } = useStoreon()

  const [fetchedData, setFetchedData] = useState(undefined)

  useEffect(() => {
    dispatch(types.FETCH_MODEL, {
      id: modelId,
      onFinish: data => {
        setFetchedData(data)
      },
      onError: () => {
        setFetchedData(null)
      },
    })
  }, [dispatch, modelId])

  if (fetchedData === null) return <Redirect to={'/'} />

  if (fetchedData && fetchedData.identifier)
    return <Redirect to={`/${fetchedData.identifier}`} />
  return null
}

export default RedirectModel
