import * as R from 'ramda'
import api from '@services/api'
import { storageService } from '@services'
import { STATUSES, getStatusState } from '@store/constants'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const noop = () => null

export default store => {
  store.on(types.STORE_INIT, () => ({
    uploadModelPhase1: { ...getStatusState(STATUSES.INIT), data: {} },
    uploadModelPhase2: { ...getStatusState(STATUSES.INIT), data: {} },
  }))
  store.on(types.RESET_UPLOAD_MODEL, () => ({
    uploadModelPhase1: { ...getStatusState(STATUSES.INIT), data: {} },
    uploadModelPhase2: { ...getStatusState(STATUSES.INIT), data: {} },
  }))

  store.on(
    types.CHANGE_UPLOAD_MODEL_STATUS,
    (state, { atom, status = STATUSES.INIT, data }) => ({
      [atom]: {
        ...state[atom],
        ...getStatusState(status),
        data,
      },
    })
  )
  store.on(types.UPLOAD_MODEL_PHASE1, async (_, { file, onFinish = noop }) => {
    store.dispatch(types.CHANGE_UPLOAD_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'uploadModelPhase1',
    })

    try {
      const { data: uploadedUrlData } = await api({
        method: 'GET',
        endpoint: `models/upload-url?fileName=${file.name}`,
      })

      await storageService.uploadToSignedUrl(uploadedUrlData.signedUrl, file)

      store.dispatch(types.CHANGE_UPLOAD_MODEL_STATUS, {
        status: STATUSES.LOADED,
        atom: 'uploadModelPhase1',
        data: { file, uploadedUrlData },
      })

      onFinish()
    } catch (e) {
      store.dispatch(types.CHANGE_UPLOAD_MODEL_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'uploadModelPhase1',
      })
    }
  })
  store.on(types.UPLOAD_MODEL_PHASE2, async (state, { data, onFinish = noop }) => {
    store.dispatch(types.CHANGE_UPLOAD_MODEL_STATUS, {
      status: STATUSES.LOADING,
      atom: 'uploadModelPhase2',
    })

    try {
      const filename =
        R.path(['uploadModelPhase1', 'data', 'uploadedUrlData', 'newFileName'], state) ||
        ''
      const originalFileName =
        R.path(['uploadModelPhase1', 'data', 'file', 'name'], state) || ''

      const { data: uploadedData, error } = await api({
        method: 'POST',
        endpoint: 'models',
        body: [
          {
            filename,
            originalFileName,
            units: 'mm',
            searchUpload: false,
            isPrivate: false,
            ...data,
          },
        ],
      })

      if (error) {
        store.dispatch(types.CHANGE_UPLOAD_MODEL_STATUS, {
          status: STATUSES.FAILURE,
          atom: 'uploadModelPhase2',
        })
      } else {
        store.dispatch(types.CHANGE_UPLOAD_MODEL_STATUS, {
          status: STATUSES.LOADED,
          atom: 'uploadModelPhase2',
          data: uploadedData,
        })
        onFinish()
        if (data && data.previousVersionModelId) {
          track('New Version Uploaded')
        } else {
          track('New Model Uploaded')
        }
      }
    } catch (e) {
      store.dispatch(types.CHANGE_UPLOAD_MODEL_STATUS, {
        status: STATUSES.FAILURE,
        atom: 'uploadModelPhase2',
      })
    }
  })
}
