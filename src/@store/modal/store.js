const getInitAtom = () => ({
  isOpen: false,
  isHidden: false,
  currentModal: null,
  modalData: null,
})

export default store => {
  store.on('@init', () => ({
    modal: getInitAtom(),
  }))
  store.on('open-modal', (state, { modalName, modalData }) => ({
    modal: {
      isOpen: true,
      currentModal: modalName,
      modalData: modalData,
    },
  }))
  store.on('hide-modal', state => ({
    modal: {
      ...state.modal,
      isHidden: true,
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
