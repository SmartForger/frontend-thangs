import React, { useRef, useState } from 'react'
import * as R from 'ramda'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { Spacer, Spinner, Tag } from '@components'
import { Label } from '@physna/voxel-ui/@atoms/Typography'

import { ReactComponent as ARIcon } from '@svg/icon-ar.svg'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md_viewer },
  } = theme
  return {
    ViewARLink: {
      alignItems: 'center',
      backgroundColor: theme.colors.white[900],
      border: 'none',
      borderRadius: '.5rem',
      color: theme.colors.black[500],
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      outline: 'none',
      padding: '.75rem 1rem',
      textAlign: 'center',
      userSelect: 'none',

      '&:hover': {
        backgroundColor: theme.colors.grey[100],
      },

      '&[disabled]': {
        cursor: 'not-allowed',
        opacity: '0.8',
        '&:hover': {
          opacity: '1',
        },
      },

      [md_viewer]: {
        display: 'none',
      },
    },
    BetaTag: {
      backgroundColor: theme.colors.grey[400],
      height: 'max-content',
    },
    ViewARLink_Container: {
      display: 'flex',
      overflow: 'hidden',
      whiteSpace: 'break-spaces',
      alignItems: 'center',
    },
    ViewARLink_ARBadge: {
      borderRadius: '.25rem',
      minWidth: '34px',
    },
    ViewARLink_AndroidOS: {
      display: 'flex',
    },
    ViewARLink_Text: {
      flexWrap: 'wrap',
      whiteSpace: 'pre-wrap',
      textAlign: 'left',
    },
    ViewARLink_Spinner: {
      width: '2rem',
      height: '2rem',
    },
  }
})

const ViewNativeARLink = ({ model }) => {
  const c = useStyles({})
  const [isOpeningViewer, setIsOpeningViewer] = useState(false)
  const [cannotOpenVRLink, setCannotOpenVRLink] = useState(false)

  const detectIfOpenedTimeoutRef = useRef()
  const timeoutIfLinkDoesntBlur = () => {
    setCannotOpenVRLink(false)
    setIsOpeningViewer(true)
    detectIfOpenedTimeoutRef.current = window.setTimeout(() => {
      detectIfOpenedTimeoutRef.current = null
      setCannotOpenVRLink(true)
      setIsOpeningViewer(false)
    }, 2000)
  }

  const considerOpenedIfBlurred = () => {
    if (detectIfOpenedTimeoutRef.current) {
      setIsOpeningViewer(false)
      window.clearTimeout(detectIfOpenedTimeoutRef.current)
      detectIfOpenedTimeoutRef.current = null
    }
  }

  const { parts } = model
  let primaryPart = null
  if (parts) {
    if (parts.length > 1) {
      primaryPart = R.find(R.propEq('isPrimary', true))(parts) || parts[0]
    } else {
      primaryPart = parts[0]
    }
  }
  if (!primaryPart || !primaryPart.androidUrl) return null
  return (
    <>
      <Spacer size={'1rem'} />
      <a
        className={c.ViewARLink}
        disabled={cannotOpenVRLink}
        onClick={timeoutIfLinkDoesntBlur}
        onBlur={considerOpenedIfBlurred}
        href={`intent://arvr.google.com/scene-viewer/1.0?file=${primaryPart?.androidUrl?.replace(
          '#',
          encodeURIComponent('#')
        )}&mode=ar_only#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`}
      >
        {cannotOpenVRLink ? (
          <>
            <ARIcon className={c.ViewARLink_ARBadge} />
            <Spacer size={'.5rem'} />
            <Label className={c.ViewARLink_Text}>
              Unable to Open Android Native AR Viewer on This Device
            </Label>
          </>
        ) : (
          <div className={c.ViewARLink_Container}>
            <ARIcon className={c.ViewARLink_ARBadge} />
            <Spacer size={'.5rem'} />
            <Label className={c.ViewARLink_Text}>
              Android Native AR Viewer (No&nbsp;App&nbsp;Required)
            </Label>
            <Spacer size={'.5rem'} />

            {isOpeningViewer ? (
              <>
                <Spacer size={'1rem'} />
                <Spinner className={c.ViewARLink_Spinner} />
              </>
            ) : (
              <Tag className={c.BetaTag} lightText>
                BETA
              </Tag>
            )}
          </div>
        )}
      </a>
    </>
  )
}

export default ViewNativeARLink
