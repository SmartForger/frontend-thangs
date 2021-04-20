import React, { useEffect } from 'react'
import { useStoreon } from 'storeon/react'
import CompareViewer from './CompareViewer'
import * as types from '@constants/storeEventTypes'

const CompareViewerContainer = props => {
  const { phynId1, phynId2 } = props
  const { dispatch, compare } = useStoreon('compare')
  const { token, isLoading: isLoadingToken } = compare

  useEffect(() => {
    dispatch(types.FETCH_COMPARE_TOKEN)
  }, [dispatch])

  return (
    <CompareViewer
      model1={phynId1}
      model2={phynId2}
      token={token}
      isLoading={!token || isLoadingToken}
    />
  )
}

CompareViewerContainer.displayName = 'CompareViewerContainer'

export default CompareViewerContainer
