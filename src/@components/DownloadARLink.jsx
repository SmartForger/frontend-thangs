import React, { useCallback, useMemo } from 'react'
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
  const { dispatch, arDownload } = useStoreon('arDownload')
  const downloadModel = useCallback(
    format => {
      dispatch(types.DOWNLOAD_AR_MODEL, {
        id: model.id ?? model.modelId,
        fileName: model.name ?? model.fileName,
        format,
        trackingEvent: downloadTrackingEvent,
      })
    },
    [dispatch, model.id, model.modelId, model.name, model.fileName, downloadTrackingEvent]
  )

  const isLoading = useMemo(() => arDownload.isDownloadMode && arDownload.isLoading, [
    arDownload.isDownloadMode,
    arDownload.isLoading,
  ])

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
      <ARDownloadActionMenu
        onChange={handleClick}
        TargetComponent={TargetComponent}
        isLoading={isLoading}
      />
    </div>
  )
}

export { DownloadARLink }
