import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import {storageService} from '../../@services'

const getInitAtom = () => ({
  isLoaded: false,
  isLoading: false,
  isError: false,
  data: {},
})

export default store => {
  store.on(types.INIT_USER_AVATAR, () => ({
    userUploadAvatar: getInitAtom(),
  }))

  store.on(types.LOADING_USER_AVATAR, state => ({
    userUploadAvatar: {
      ...state.userUploadAvatar,
      isLoading: true,
      isLoaded: false,
    },
  }))

  store.on(types.LOADED_USER_AVATAR, (state, {data}) => ({
    userUploadAvatar: {
      ...state.userUploadAvatar,
      isLoading: false,
      isLoaded: true,
      data,
    },
  }))

  store.on(types.FAILED_USER_AVATAR, (state) => ({
    userUploadAvatar: {
      ...state.userUploadAvatar,
      isLoading: false,
      isLoaded: true,
      isError: true,
    },
  }))

  store.on(types.UPLOAD_USER_AVATAR, async (_, {userId, file}) => {
    store.dispatch(types.LOADING_USER_AVATAR)
    const {data: avatarData, error} = await api({
      method: 'GET',
      endpoint: `users/${userId}/upload-avatar`
    })

    if (error) {
      store.dispatch(types.FAILED_USER_AVATAR)
    } else {
      await storageService.uploadToSignedUrl(avatarData?.signedUrl, file)
      store.dispatch(types.LOADED_USER_AVATAR, {data: avatarData?.signedUrl})
      store.dispatch(types.FETCH_USER, {id: userId})
    }
  })

  store.on(types.DELETE_USER_AVATAR, async (_, {userId}) => {
    store.dispatch(types.LOADING_USER_AVATAR)
    const {data, error} = await api({method: 'DELETE', endpoint: `users/${userId}/avatar`})
    if (error) {
      store.dispatch(types.FAILED_USER_AVATAR)
    } else {
      store.dispatch(types.LOADED_USER_AVATAR, {data})
      store.dispatch(types.UPDATE_USER_AVATAR, {userId: userId, data: null})
    }
  })
}
