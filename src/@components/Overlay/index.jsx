import React, { useEffect } from 'react'
import ReactModal from 'react-modal'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { Button } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'
import * as types from '@constants/storeEventTypes'

ReactModal.setAppElement('#root')

const useStyles = createUseStyles(_theme => {
  return {
    Overlay: {
      position: 'relative',
      overflow: 'auto',
      outline: 'none',
      width: '100%',
      height: '100%',
    },
    Overlay_CloseButton: {
      position: 'absolute',
      right: '3rem',
      top: '3rem',
      cursor: 'pointer',
    },
    Overlay_Content: {
      width: '90%',
      margin: '6rem auto 0',
      maxWidth: ({ windowed }) => (windowed ? '49.75rem' : '32rem'),
    },
  }
})
const noop = () => null
const Overlay = ({
  children,
  className,
  onOverlayClose = noop,
  windowed = false,
  ...props
}) => {
  const { dispatch } = useStoreon()
  const c = useStyles({ windowed })
  useEffect(() => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
  }, [])

  return (
    <ReactModal
      className={classnames(className, c.Overlay)}
      style={{
        overlay: {
          position: 'fixed',
          top: '6.125rem',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: windowed ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
        },
      }}
      {...props}
    >
      <Button
        text
        className={c.Overlay_CloseButton}
        onClick={() => {
          onOverlayClose()
          dispatch(types.CLOSE_OVERLAY)
        }}
      >
        {!windowed && <ExitIcon />}
      </Button>
      <div className={c.Overlay_Content}>{children}</div>
    </ReactModal>
  )
}

export default Overlay
