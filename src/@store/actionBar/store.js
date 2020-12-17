import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isOpen: false,
  isHidden: false,
  Component: null,
  data: null,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    actionBar: getInitAtom(),
  }))
  store.on(types.OPEN_ACTION_BAR, (state, { Component, data }) => ({
    actionBar: {
      isOpen: true,
      Component,
      data,
    },
  }))
  store.on(types.CLOSE_ACTION_BAR, () => ({
    actionBar: {
      isOpen: false,
      Component: null,
      data: null,
    },
  }))
  store.on(types.SET_ACTION_BAR_DATA, (state, { data }) => ({
    actionBar: {
      ...state.actionBar,
      data: {
        ...state.actionBar.data,
        ...data,
      },
    },
  }))
}
