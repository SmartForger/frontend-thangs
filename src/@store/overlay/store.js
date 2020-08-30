import * as types from '@constants/storeEventTypes'

const getInitAtom = () => ({
  isOpen: false,
  isHidden: false,
  currentModal: null,
  modalData: null,
})

export default store => {
  store.on(types.STORE_INIT, () => ({
    modal: getInitAtom(),
  }))
  store.on(types.OPEN_OVERLAY, (state, { modalName, modalData }) => ({
    modal: {
      isOpen: true,
      currentModal: modalName,
      modalData: modalData,
    },
  }))
  store.on(types.CLOSE_OVERLAY, () => ({
    modal: {
      isOpen: false,
      currentModal: null,
      modalData: null,
    },
  }))
}
