import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ARDownloadActionMenu } from '@components'
import * as types from '@constants/storeEventTypes'
import { canDownloadAR } from '@utilities'
import { track } from '@utilities/analytics'

const useStyles = createUseStyles(() => {
  return {
    DownloadARLink: {
      width: '100%',

      '& > div': {
        width: '100%',
      },

      '& > div > div': {
        width: '100%',
      },
    },
  }
})

const noop = () => null
const DownloadARLink = ({ model, isAuthedUser, openSignupOverlay = noop }) => {
  const c = useStyles()
  const isARSupported = useMemo(() => canDownloadAR(model), [model])
  const { dispatch } = useStoreon()
  const downloadModel = useCallback(
    format => {
      if (format !== 'android') return //TEMP - Remove once ios is available
      dispatch(types.FETCH_MODEL_DOWNLOAD_URL, {
        id: model.id,
        format,
        onFinish: downloadUrl => {
          window.location.assign(downloadUrl)
          track('Download AR', { format, modelId: model.id })
        },
      })
    },
    [dispatch, model.id]
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
    <>
      {isARSupported ? (
        <div className={c.DownloadARLink}>
          <ARDownloadActionMenu onChange={handleClick} />
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export { DownloadARLink }
