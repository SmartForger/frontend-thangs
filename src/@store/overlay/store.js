import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isOpen: false,
  isHidden: false,
  currentOverlay: null,
  overlayData: null,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    overlay: getInitAtom(),
  }))
  store.on(types.OPEN_OVERLAY, (state, { overlayName, overlayData }) => ({
    overlay: {
      isOpen: true,
      currentOverlay: overlayName,
      overlayData: overlayData,
    },
  }))
  store.on(types.CLOSE_OVERLAY, () => ({
    overlay: {
      isOpen: false,
      currentOverlay: null,
      overlayData: null,
    },
  }))
}
