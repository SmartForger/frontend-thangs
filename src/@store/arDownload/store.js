import * as R from 'ramda'
import axios from 'axios'

import api from '@services/api'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'
import { STATUSES, getStatusState } from '@store/constants'

const getInitAtom = () => ({
  ...getStatusState(STATUSES.INIT),
})

export const AR_MODE = {
  DOWNLOAD: 'download',
  VIEW: 'view',
}

export default store => {
  store.on(types.STORE_INIT, () => ({
    arDownload: getInitAtom(),
  }))

  store.on(types.LOADING_AR_DOWNLOAD, (state, { mode, id }) => ({
    arDownload: {
      ...state.arDownload,
      ...getStatusState(STATUSES.LOADING),
      isViewMode: AR_MODE.VIEW === mode,
      isDownloadMode: AR_MODE.DOWNLOAD === mode,
      targetId: id ?? state.arDownload.targetId,
    },
  }))

  store.on(types.LOADED_AR_DOWNLOAD, (state, { mode, id }) => ({
    arDownload: {
      ...state.arDownload,
      ...getStatusState(STATUSES.LOADED),
      isViewMode: AR_MODE.VIEW === mode,
      isDownloadMode: AR_MODE.DOWNLOAD === mode,
      targetId: id ?? state.arDownload.targetId,
    },
  }))

  store.on(types.FAILED_AR_DOWNLOAD, (state, { mode, id }) => ({
    arDownload: {
      ...state.arDownload,
      ...getStatusState(STATUSES.FAILURE),
      isViewMode: AR_MODE.VIEW === mode,
      isDownloadMode: AR_MODE.DOWNLOAD === mode,
      targetId: id ?? state.arDownload.targetId,
    },
  }))

  store.on(
    types.FETCH_AR_DOWNLOAD_URL,
    async (_, { id, format, onFinish, mode = AR_MODE.DOWNLOAD }) => {
      const { data, error } = await api({
        method: 'GET',
        endpoint: `models/${id}/download-url?targetFormat=${format}`,
      })

      if (error || data?.fileName === 'Error') {
        store.dispatch(types.FAILED_AR_DOWNLOAD, { mode, id })
      } else {
        onFinish(data && data.signedUrl)
      }
    }
  )

  store.on(
    types.DOWNLOAD_AR_MODEL,
    async (_, { id, fileName, format, trackingEvent = 'Download AR' }) => {
      store.dispatch(types.LOADING_AR_DOWNLOAD, { mode: AR_MODE.DOWNLOAD, id })
      store.dispatch(types.FETCH_AR_DOWNLOAD_URL, {
        id,
        format,
        mode: AR_MODE.DOWNLOAD,
        onFinish: async url => {
          // Downloading via iframe seems to have the best coverage in terms of forcing the download flow
          // Safari and Firefox both work fine, but Chrome autoopens like a jerk still
          const iframe = document.createElement('iframe')
          iframe.src = `${url.replaceAll(
            '#',
            encodeURIComponent('#')
          )}&cacheBuster=${Date.now()}`
          iframe.id = 'download-ar'
          iframe.style.display = 'none'
          document.body.appendChild(iframe)

          track(trackingEvent, { format, modelId: id, fileName })
          store.dispatch(types.LOADED_AR_DOWNLOAD, { mode: AR_MODE.DOWNLOAD, id })
        },
      })
    }
  )

  store.on(
    types.VIEW_AR_MODEL,
    async (_, { model, format, trackingEvent = 'View Native AR' }) => {
      const id = model.id ?? model.modelId
      const fileName = model.name ?? model.fileName

      store.dispatch(types.LOADING_AR_DOWNLOAD, { mode: AR_MODE.VIEW, id })
      store.dispatch(types.FETCH_AR_DOWNLOAD_URL, {
        id,
        format,
        mode: AR_MODE.DOWNLOAD,
        onFinish: async url => {
          // Native Android viewer requires the file to be loaded first, so this call forces us to generate the model if not already available
          if (format === 'android') {
            const { parts } = model
            let primaryPart

            if (parts) {
              if (parts.length > 1) {
                primaryPart = R.find(R.propEq('isPrimary', true))(parts) || parts[0]
              } else {
                primaryPart = parts[0]
              }
            }

            if (!primaryPart || !primaryPart?.androidUrl) {
              store.dispatch(types.FAILED_AR_DOWNLOAD, { mode: AR_MODE.VIEW, id })
            } else {
              let isGLBReady = false
              try {
                const { error } = await axios.get(url)
                if (!error) {
                  isGLBReady = true
                }
              } catch (e) {
                if (e.isAxiosError) {
                  isGLBReady = true
                }
              } finally {
                if (isGLBReady) {
                  // TODO - We ideally should be using the signed url from the endpoint but it seems to be breaking arcore
                  const arCoreFriendlyUrl = `${
                    primaryPart.androidUrl
                  }?cachebuster=${Date.now()}`
                    .replaceAll('?', encodeURIComponent('?'))
                    .replaceAll('&', encodeURIComponent('&'))
                    .replaceAll('#', encodeURIComponent('#'))

                  const link = document.createElement('a')

                  link.href = `intent://arvr.google.com/scene-viewer/1.1?file=${arCoreFriendlyUrl}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`

                  link.appendChild(document.createTextNode('Open intent'))
                  link.click()
                } else {
                  store.dispatch(types.FAILED_AR_DOWNLOAD, { mode: AR_MODE.VIEW, id })
                }
              }
            }
          } else if (format === 'ios') {
            const link = document.createElement('a')
            link.href = `${url.replaceAll(
              '#',
              encodeURIComponent('#')
            )}&cacheBuster=${Date.now()}`
            // This should stop the navigate-away in Safari and make Safari-based browsers work better
            link.rel = 'ar'
            link.appendChild(document.createElement('img'))

            link.click()
          }

          store.dispatch(types.LOADED_AR_DOWNLOAD, { mode: AR_MODE.VIEW, id })
          track(trackingEvent, {
            format,
            modelId: id,
            fileName,
          })
        },
      })
    }
  )
}
