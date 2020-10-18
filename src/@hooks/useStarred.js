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
    const filteredModels = models.filter(
      model => model && model.owner && model.owner.id === userId
    )
    const filteredFolders = folders.filter(
      folder =>
        folder &&
        folder.creator &&
        folder.creator.id &&
        folder.creator.id.toString() === userId
    )
    const othersModels = models.filter(
      model => model && model.owner && model.owner.id !== userId
    )
    const othersFolders = folders.filter(folder => {
      return (
        folder &&
        folder.creator &&
        folder.creator.id &&
        folder.creator.id.toString() !== userId &&
        folder.members.some(
          member => member && member.id && member.id.toString() === userId
        )
      )
    })

    return {
      starredModels: filteredModels,
      starredFolders: filteredFolders,
      starredSharedModels: othersModels,
      starredSharedFolders: othersFolders,
    }
  }, [likedUserModelsAtom, userId])

  return starred
}

export default useStarred
