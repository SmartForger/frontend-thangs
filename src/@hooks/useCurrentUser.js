import { useContext, useCallback } from 'react'
import * as R from 'ramda'
import { StoreContext, useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'
import useCurrentUserId from './useCurrentUserId'

const useCurrentUser = () => {
  const currentId = useCurrentUserId()

  const { currentUser, dispatch } = useStoreon('currentUser')
  const store = useContext(StoreContext)
  const getCurrentUser = useCallback(() => store.get()['currentUser'], [store])

  if (currentId && !getCurrentUser().isLoading && !getCurrentUser().isLoaded) {
    dispatch(types.FETCH_CURRENT_USER, {})
  }

  if (!currentId && !R.isEmpty(getCurrentUser().data)) {
    dispatch(types.RESET_CURRENT_USER)
  }

  return { atom: currentUser, dispatch }
}

export default useCurrentUser
