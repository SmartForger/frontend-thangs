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
  store.on('open-modal', (state, { modalName, modalData }) => ({
    modal: {
      isOpen: true,
      currentModal: modalName,
      modalData: modalData,
    },
  }))
  store.on('close-modal', () => ({
    modal: {
      isOpen: false,
      currentModal: null,
      modalData: null,
    },
  }))
}
