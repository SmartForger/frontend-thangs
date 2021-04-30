import * as R from 'ramda'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useStoreon } from 'storeon/react'

import { createUseStyles } from '@physna/voxel-ui/@style'
import { Title, HeaderLevel } from '@physna/voxel-ui/@atoms/Typography'

import * as types from '@constants/storeEventTypes'
import { useIsIOS, useIsAndroid, useLocalStorage } from '@hooks'
import { Button, ContainerColumn, Spacer } from '@components'
import { track } from '@utilities/analytics'
import { Link, Metadata, MetadataType } from '@physna/voxel-ui/@atoms/Typography'
import axios from 'axios'

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

  const primaryPart = useMemo(() => {
    const { parts } = model
    if (parts) {
      if (parts.length > 1) {
        return R.find(R.propEq('isPrimary', true))(parts) || parts[0]
      } else {
        return parts[0]
      }
    }

    return null
  }, [model])
  const [downloadURL, setDownloadURL] = useState(null)
  useEffect(() => {
    dispatch(types.FETCH_AR_DOWNLOAD_URL, {
      id: model.id,
      format: 'android',
      mode: 'foo',
      onFinish: async url => {
        await axios.get(url)
        setDownloadURL(url)
      },
    })
  }, [dispatch, model.id])

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
          {false && (
            <>
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
            </>
          )}
          {downloadURL && primaryPart && (
            <ContainerColumn>
              <Spacer size='0.5rem' />
              <Link
                to={
                  'intent://arvr.google.com/scene-viewer/1.1?file=https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF/Avocado.gltf#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;'
                }
              >
                Avocado Example (Khronos GH)
              </Link>
              <Title headerLevel={HeaderLevel.secondary}>AR Core</Title>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${primaryPart.androidUrl.replaceAll(
                  '#',
                  encodeURIComponent('#')
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - No encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Single encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  encodeURI(
                    primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                  )
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Double encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Single component encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  encodeURIComponent(
                    primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                  )
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Double component encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${downloadURL.replaceAll(
                  '#',
                  encodeURIComponent('#')
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - No encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  downloadURL.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Single encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  encodeURI(downloadURL.replaceAll('#', encodeURIComponent('#')))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Double encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  downloadURL.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Single component encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  encodeURIComponent(downloadURL.replaceAll('#', encodeURIComponent('#')))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Double component encoding
              </Link>
              <Spacer size='0.5rem' />
              <Title headerLevel={HeaderLevel.secondary}>AR Core</Title>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${primaryPart.androidUrl.replaceAll(
                  '#',
                  encodeURIComponent('#')
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - No encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Single encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  encodeURI(
                    primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                  )
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Double encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Single component encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  encodeURIComponent(
                    primaryPart.androidUrl.replaceAll('#', encodeURIComponent('#'))
                  )
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Android URL - Double component encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${downloadURL.replaceAll(
                  '#',
                  encodeURIComponent('#')
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - No encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  downloadURL.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Single encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURI(
                  encodeURI(downloadURL.replaceAll('#', encodeURIComponent('#')))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Double encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  downloadURL.replaceAll('#', encodeURIComponent('#'))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Single component encoding
              </Link>
              <Spacer size='0.5rem' />
              <Link
                to={`intent://arvr.google.com/scene-viewer/1.1?file=${encodeURIComponent(
                  encodeURIComponent(downloadURL.replaceAll('#', encodeURIComponent('#')))
                )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
              >
                Download URL - Double component encoding
              </Link>
              <Spacer size='0.5rem' />
            </ContainerColumn>
          )}
        </ContainerColumn>
      )}
    </>
  )
}

export default ViewNativeARLink
