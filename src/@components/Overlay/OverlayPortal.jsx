import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    OverlayPortal: {
      backgroundColor: theme.colors.white[300],
      bottom: 0,
      left: 0,
      position: 'fixed',
      right: 0,
      top: 0,
      zIndex: '10',

      [md]: {
        backgroundColor: ({ windowed }) =>
          windowed ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      },
    },
    OverlayPortal__isVisible: {
      opacity: '1 !important',
      top: '0 !important',
    },
    OverlayContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      position: 'relative',
      top: '30px',
      transition: 'all 450ms',
      marginTop: 0,

      [md]: {
        alignItems: 'baseline',
        marginTop: '10vh',
      },

      '& > div': {
        borderRadius: 0,
        height: '100%',

        [md]: {
          borderRadius: '1rem',
          height: 'auto',
        },
      },
    },
    OverlayContent__isVisible: {
      top: 0,
    },
    Overlay_CloseButton: {
      position: 'absolute',
      cursor: 'pointer',
      top: '10%',

      [md]: {
        top: 0,
      },
    },
  }
})

const OverlayPortal = ({ className, scrollTop }) => {
  const [isVisible, setIsVisible] = useState(false)
  const { setOverlayOpen, OverlayComponent, overlayData = {} } = useOverlay()
  const windowed = overlayData.windowed
  const c = useStyles({ windowed })

  const handleClose = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  useEffect(() => {
    if (scrollTop) {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
    if (OverlayComponent) {
      setTimeout(() => {
        setIsVisible(true)
      }, 0)
    } else {
      setIsVisible(false)
    }
  }, [OverlayComponent, scrollTop])

  if (OverlayComponent) {
    return createPortal(
      <div
        className={classnames(className, c.OverlayPortal, {
          [c.OverlayPortal__isVisible]: isVisible,
        })}
      >
        <div
          className={classnames(c.OverlayContent, {
            [c.OverlayContent__isVisible]: isVisible,
          })}
        >
          {!windowed && (
            <div
              className={c.Overlay_CloseButton}
              onClick={() => {
                if (
                  overlayData.onOverlayClose &&
                  typeof overlayData.onOverlayClose === 'function'
                ) {
                  overlayData.onOverlayClose()
                }
                handleClose()
              }}
            >
              <ExitIcon />
            </div>
          )}
          <OverlayComponent {...overlayData} />
        </div>
      </div>,
      document.querySelector('#overlay-root')
    )
  } else return null
}

export default OverlayPortal
