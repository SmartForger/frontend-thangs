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

  const starred = useMemo(() => {
    const { data = {} } = likedUserModelsAtom
    const { models = [], folders = [] } = data
    const filteredModels = models.filter(model => model.owner.id === userId)
    const filteredFolders = folders.filter(
      folder => folder.creator.id.toString() === userId
    )

    return {
      starredModels: filteredModels,
      starredFolders: filteredFolders,
    }
  }, [likedUserModelsAtom, userId])

  return starred
}

export default useStarred
