import { useEffect, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { authenticationService } from '@services'
import * as types from '@constants/storeEventTypes'

const useStarred = () => {
  const userId = authenticationService.getCurrentUserId()
  const {
    dispatch,
    [`user-liked-models-${userId}`]: likedUserModelsAtom = {},
  } = useStoreon(`user-liked-models-${userId}`)

  useEffect(() => {
    dispatch(types.FETCH_USER_LIKED_MODELS, { id: userId })
  }, [dispatch, userId])

  const starredModels = useMemo(() => {
    const { data } = likedUserModelsAtom
    if (!data || !data.length) return []
    return data.filter(model => model.owner.id === userId)
  }, [likedUserModelsAtom, userId])

  return { starredModels }
}

export default useStarred
