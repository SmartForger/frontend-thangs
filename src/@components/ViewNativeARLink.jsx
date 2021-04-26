import React, { useCallback } from 'react'
import * as R from 'ramda'
import { useStoreon } from 'storeon/react'

import { createUseStyles } from '@physna/voxel-ui/@style'

import * as types from '@constants/storeEventTypes'
import { NativeARDownloadActionMenu, Spacer } from '@components'
import { track } from '@utilities/analytics'
import axios from 'axios'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme

  return {
    ViewNativeARLink: {
      [md_viewer]: {
        display: 'none',
      },

      '& > div': {
        width: '100%',
      },

      '& > div > div': {
        width: 'fit-content',
      },
    },
  }
})

const noop = () => null
const ViewNativeARLink = ({
  model,
  isAuthedUser,
  openSignupOverlay = noop,
  trackingEvent = 'View Native AR',
}) => {
  const c = useStyles({})
  const { dispatch } = useStoreon()

  const downloadModel = useCallback(
    format => {
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        id: model.id ?? model.modelId,
        format,
        onFinish: async downloadUrl => {
          track(trackingEvent, { format, modelId: model.id ?? model.modelId })

          if (format === 'android') {
            const { parts } = model
            let primaryPart = null
            if (parts) {
              if (parts.length > 1) {
                primaryPart = R.find(R.propEq('isPrimary', true))(parts) || parts[0]
              } else {
                primaryPart = parts[0]
              }
            }

            if (primaryPart && primaryPart.androidUrl) {
              let isGLBReady = false
              try {
                const { error } = await axios.get(downloadUrl)
                if (!error) {
                  isGLBReady = true
                }
              } catch (e) {
                if (e.isAxiosError) {
                  isGLBReady = true
                }
              }

              if (isGLBReady) {
                const link = document.createElement('a')
                link.href = `intent://arvr.google.com/scene-viewer/1.0?file=${downloadUrl.replaceAll(
                  '#',
                  encodeURIComponent('#')
                )}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`
                link.click()
              }
            }
          } else if (format === 'ios') {
            window.location.assign(
              `${downloadUrl.replaceAll(
                '#',
                encodeURIComponent('#')
              )}&cacheBuster=${Date.now()}`
            )
          }
        },
      })
    },
    [dispatch, model.id, model.modelId, trackingEvent]
  )

  const handleClick = useCallback(
    format => {
      if (isAuthedUser) {
        downloadModel(format)
      } else {
        openSignupOverlay('Join to open AR models on your phone.', 'View Native AR')
        track('SignUp Prompt Overlay', { source: 'View Native AR', format })
      }
    },
    [downloadModel, isAuthedUser, openSignupOverlay]
  )

  return (
    <div className={c.ViewNativeARLink}>
      <Spacer size='1rem' />
      <NativeARDownloadActionMenu onChange={handleClick} />
    </div>
  )
}

export default ViewNativeARLink
