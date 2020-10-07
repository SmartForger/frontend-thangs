import * as types from '@constants/storeEventTypes'

export default store => {
  store.on(types.STORE_INIT, () => ({
    folderNav: {
      files: false,
    },
  }))

  store.on(types.FOLDER_OPEN, (state, { id }) => ({
    folderNav: {
      ...state.folderNav,
      [id]: true,
    },
  }))

  store.on(types.FOLDER_CLOSE, (state, { id }) => ({
    folderNav: {
      ...state.folderNav,
      [id]: false,
    },
  }))
}
