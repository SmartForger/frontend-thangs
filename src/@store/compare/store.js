import * as types from '@constants/storeEventTypes'
import api from '@services/api'

// const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    compare: {
      token: undefined,
      isLoading: false,
      isError: false,
    },
  }))

  store.on(types.FAILED_COMPARE_TOKEN, () => ({
    compare: {
      token: undefined,
      isLoading: false,
      isError: true,
    },
  }))

  store.on(types.LOADING_COMPARE_TOKEN, state => ({
    compare: {
      ...state.compare,
      token: undefined,
      isLoading: true,
      isError: false,
    },
  }))

  store.on(types.LOADED_COMPARE_TOKEN, (state, { data }) => ({
    compare: {
      ...state.compare,
      token: data,
      isLoading: false,
      isError: false,
    },
  }))

  store.on(types.FETCH_COMPARE_TOKEN, async _state => {
    store.dispatch(types.LOADING_COMPARE_TOKEN)
    const { data, error } = await api({
      method: 'POST',
      endpoint: 'auth/compare',
    })

    if (error) {
      store.dispatch(types.FAILED_COMPARE_TOKEN)
    } else {
      store.dispatch(types.LOADED_COMPARE_TOKEN, {
        data,
      })
    }
  })

  store.on(types.SET_COMPARE_MODELS, (state, { model1, model2 }) => ({
    compare: {
      ...state.compare,
      model1,
      model2,
    },
  }))

  store.on(types.GET_UPLOAD_COMPARE_ID, (
    _state /*{ files = [], data, onError = noop }**/
  ) => {
    // let uploadedUrlData

    // apiForChain({
    //   method: 'GET',
    //   endpoint: `models/upload-url?fileName=${file.name.replace(
    //     '#',
    //     encodeURIComponent('#')
    //   )}`,
    // })
    //   .then(({ data }) => {
    //     uploadedUrlData = data
    //     return storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)
    //   })
    //   .then(() => {
    //     return apiForChain({
    //       method: 'POST',
    //       endpoint: 'models/ingest-only',
    //       body: {
    //         filename: uploadedUrlData.newFileName || '',
    //         originalFileName: file.name,
    //         units: 'mm',
    //         isPrivate: true,
    //         ...data,
    //       },
    //     })
    //   })
    //   .then(({ data: uploadedData }) => {
    //     const { newPhyndexerId: phyndexerId } = uploadedData

    //     store.dispatch(types.SET_COMPARE_MODELS, { model2: phyndexerId })
    //   })
    //   .catch(error => {
    //     store.dispatch(types.CHANGE_GEO_SEARCH_RESULTS_STATUS)
    //     return onError(error)
    //   })

    return {
      phyndexerId: 'need',
    }
  })
}
