import { useContext, useCallback } from 'react'
import * as R from 'ramda'
import { StoreContext, useStoreon } from 'storeon/react'
import * as storeEventTypes from '@constants/storeEventTypes'
import useCurrentUserId from './useCurrentUserId'

const useCurrentUser = () => {
  const currentId = useCurrentUserId()

  const { currentUser, dispatch } = useStoreon('currentUser')
  const store = useContext(StoreContext)
  const getCurrentUser = useCallback(() => store.get()['currentUser'], [store])

  if (currentId && !getCurrentUser().isLoading && !getCurrentUser().isLoaded) {
    dispatch(storeEventTypes.FETCH_CURRENT_USER, { id: currentId })
  }

  if (!currentId && !R.isEmpty(getCurrentUser().data)) {
    dispatch(storeEventTypes.RESET_CURRENT_USER)
  }

  return { atom: currentUser, dispatch }
}

export default useCurrentUser
