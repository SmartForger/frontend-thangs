import React, { useEffect } from 'react'
import { useStoreon } from 'storeon/react'
import CompareViewer from './CompareViewer'
import * as types from '@constants/storeEventTypes'

const CompareViewerContainer = () => {
  const { dispatch, compare } = useStoreon('compare')
  const { token, isLoading: isLoadingToken, model1, model2 } = compare

  useEffect(() => {
    dispatch(types.FETCH_COMPARE_TOKEN)
  }, [dispatch])

  return (
    <CompareViewer
      model1={model1}
      model2={model2}
      token={token}
      isLoading={!token || isLoadingToken}
    />
  )
}

CompareViewerContainer.displayName = 'CompareViewerContainer'

export default CompareViewerContainer
