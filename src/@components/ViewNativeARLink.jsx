import React, { useCallback, useMemo } from 'react'
import { useStoreon } from 'storeon/react'

import { createUseStyles } from '@physna/voxel-ui/@style'

import * as types from '@constants/storeEventTypes'
import { useIsIOS, useIsAndroid, useLocalStorage } from '@hooks'
import { Button, ContainerColumn, Spacer } from '@components'
import { track } from '@utilities/analytics'
import { Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'

const useStyles = createUseStyles(theme => {
  return {
    ViewNativeARLink: {
      '& > div': {
        width: '100%',
      },

      '& > div > div': {
        width: 'fit-content',
      },
    },

    ViewNativeARLink_Subtext: {
      color: theme.colors.grey[700],
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
  const { dispatch, arDownload } = useStoreon('arDownload')
  const isIOS = useIsIOS()
  const isAndroid = useIsAndroid()
  const isNativeEnabled = useLocalStorage('physna-native-ar', true)

  const isLoading = useMemo(() => arDownload.isViewMode && arDownload.isLoading, [
    arDownload.isLoading,
    arDownload.isViewMode,
  ])

  const downloadModel = useCallback(() => {
    const format = isAndroid ? 'android' : 'ios'
    dispatch(types.VIEW_AR_MODEL, { model, format, trackingEvent })
  }, [dispatch, isAndroid, model, trackingEvent])

  const handleClick = useCallback(
    format => {
      if (isLoading) return

      if (isAuthedUser) {
        downloadModel()
      } else {
        openSignupOverlay('Join to open AR models on your phone.', 'View Native AR')
        track('SignUp Prompt Overlay', { source: 'View Native AR', format })
      }
    },
    [downloadModel, isAuthedUser, isLoading, openSignupOverlay]
  )

  return (
    <>
      {isNativeEnabled && (isIOS || isAndroid) && (
        <ContainerColumn className={c.ViewNativeARLink}>
          <Spacer size='1rem' />
          <Button secondary onClick={handleClick}>
            <ContainerColumn>
              {isLoading ? 'Loading Augmented Reality...' : 'Open Augmented Reality'}
              <Metadata
                type={MetadataType.secondary}
                className={c.ViewNativeARLink_Subtext}
              >
                Mobile Only, No App Required
              </Metadata>
            </ContainerColumn>
          </Button>
        </ContainerColumn>
      )}
    </>
  )
}

export default ViewNativeARLink
