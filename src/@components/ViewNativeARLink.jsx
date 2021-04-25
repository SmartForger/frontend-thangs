import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'

import { createUseStyles } from '@physna/voxel-ui/@style'

import * as types from '@constants/storeEventTypes'
import { NativeARDownloadActionMenu, Spacer } from '@components'
import { track } from '@utilities/analytics'

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
        onFinish: downloadUrl => {
          track(trackingEvent, { format, modelId: model.id ?? model.modelId })

          if (format === 'android') {
            const link = document.createElement('a')
            link.href = `intent://arvr.google.com/scene-viewer/1.0?file=${downloadUrl}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`.replaceAll(
              '#',
              encodeURIComponent('#')
            )
            link.click()
          } else if (format === 'ios') {
            window.location.assign(downloadUrl)
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
