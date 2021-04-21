import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { authenticationService } from '@services'
import * as R from 'ramda'
import { arrayToDictionary } from '@utilities'

const getInitAtom = () => ({
  isLoading: false,
  isLoaded: false,
  isError: false,
})

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    thangs: getInitAtom(),
  }))

  store.on(types.UPDATE_THANGS, (state, event) => {
    const { folders = [], models: rootModels } = event
    let models = [
      ...R.pathOr([], ['models', 'data'], state),
      ...rootModels.map(m => ({ ...m, id: +m.id, isPublic: true })),
    ]

    folders.forEach(folder => {
      models = [
        ...models,
        ...folder.models.map(model => {
          model.isPublic = folder.isPublic
          model.folderId = folder.id
          return model
        }),
      ]
      // delete folder.models
      // delete folder.subfolders
    })

    // HOTFIX 4/20/21 - Updating a file will cause us to join the existing models with updates from backend, but uniqBy will always take the first match
    // Instead of refactoring this to either not join both arrays or be intelligent about the merge, I'm reversing the array so that we always pick the newest
    // version of a model instead of the one we fetched first
    models = R.uniqBy(R.prop('id'), models.reverse())

    return {
      activity: {
        ...state.activity,
        data: event.activity,
      },
      folders: {
        ...state.folders,
        data: arrayToDictionary(folders),
      },
      models: {
        ...state.models,
        data: models,
      },
    }
  })

  store.on(types.ERROR_THANGS, (state, _event) => ({
    thangs: {
      ...state.thangs,
      isError: true,
    },
  }))

  store.on(types.LOADING_THANGS, (state, _event) => ({
    thangs: {
      ...state.thangs,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_THANGS, (state, _event) => ({
    thangs: {
      ...state.thangs,
      isLoading: false,
      isLoaded: true,
    },
  }))

  store.on(
    types.FETCH_THANGS,
    async (_state, { onFinish = noop, onFinishData = null, silentUpdate = false }) => {
      const currentUserId = authenticationService.getCurrentUserId()
      if (!currentUserId) return
      if (!silentUpdate) {
        store.dispatch(types.LOADING_THANGS)
      }
      const { data, error } = await api({
        method: 'GET',
        endpoint: `users/${currentUserId}/thangs`,
      })

      if (error) {
        store.dispatch(types.ERROR_THANGS)
      } else {
        store.dispatch(types.UPDATE_THANGS, data)
        onFinish(onFinishData)
        store.dispatch(types.LOADED_THANGS)
      }
    }
  )
}
