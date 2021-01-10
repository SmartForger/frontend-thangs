import React, { useCallback } from 'react'
import { createPortal } from 'react-dom'
import { createUseStyles } from '@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import { useOverlay } from '@hooks'

const useStyles = createUseStyles(theme => {
  const {
    mediaQueries: { md },
  } = theme
  return {
    OverlayPortal: {
      backgroundColor: ({ windowed }) =>
        windowed ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
      bottom: '0',
      left: '0',
      position: 'fixed',
      right: '0',
      top: '0',
      zIndex: 10,
    },
    OverlayContent: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',

      '& > div': {
        borderRadius: 0,
        height: '100%',

        [md]: {
          borderRadius: '1rem',
          height: 'auto',
        },
      },
    },
  }
})

const OverlayPortal = () => {
  const { setOverlayOpen, OverlayComponent, overlayData = {} } = useOverlay()
  const windowed = overlayData.windowed
  const c = useStyles({ windowed })

  const handleClose = useCallback(() => {
    setOverlayOpen(false)
  }, [setOverlayOpen])

  if (OverlayComponent) {
    return createPortal(
      <div className={c.OverlayPortal}>
        <div className={c.OverlayContent}>
          {!windowed && (
            <div
              className={c.Overlay_CloseButton}
              onClick={() => {
                overlayData.onOverlayClose()
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
