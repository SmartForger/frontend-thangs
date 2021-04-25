import React, { useCallback } from 'react'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ARDownloadActionMenu } from '@components'
import * as types from '@constants/storeEventTypes'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(() => {
  return {
    DownloadARLink: {
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
const DownloadARLink = ({
  model,
  isAuthedUser,
  openSignupOverlay = noop,
  TargetComponent,
  downloadTrackingEvent = 'Download AR',
}) => {
  const c = useStyles()
  const { dispatch } = useStoreon()
  const downloadModel = useCallback(
    format => {
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        id: model.id ?? model.modelId,
        format,
        onFinish: downloadUrl => {
          const link = document.createElement('a')
          link.href = `${downloadUrl.replaceAll(
            '#',
            encodeURIComponent('#')
          )}&cacheBuster=${Date.now()}`
          link.download = (
            model.name ||
            model.modelFileName ||
            'thangs_model'
          ).replaceAll('.', '_')
          link.click()

          track(downloadTrackingEvent, { format, modelId: model.id ?? model.modelId })
        },
      })
    },
    [
      downloadTrackingEvent,
      dispatch,
      model.id,
      model.modelId,
      model.name,
      model.modelFileName,
    ]
  )

  const handleClick = useCallback(
    format => {
      if (isAuthedUser) {
        downloadModel(format)
      } else {
        openSignupOverlay('Join to download AR models.', 'Download')
        track('SignUp Prompt Overlay', { source: 'Download AR', format })
      }
    },
    [downloadModel, isAuthedUser, openSignupOverlay]
  )

  return (
    <div className={c.DownloadARLink}>
      <ARDownloadActionMenu onChange={handleClick} TargetComponent={TargetComponent} />
    </div>
  )
}

export { DownloadARLink }
