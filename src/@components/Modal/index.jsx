import React from 'react'
import ReactModal from 'react-modal'
import { useStoreon } from 'storeon/react'
import classnames from 'classnames'
import { Button } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ExitIcon } from '@svg/icon-X.svg'

ReactModal.setAppElement('#root')

const useStyles = createUseStyles(_theme => {
  return {
    Modal: {
      position: 'relative',
      overflow: 'auto',
      outline: 'none',
      width: '100%',
      height: '100%',
    },
    Modal_CloseButton: {
      position: 'absolute',
      right: '4rem',
      top: '2rem',
      cursor: 'pointer',
    },
    Modal_Content: {
      marginTop: '2.5rem',
    },
  }
})

const Modal = ({ children, className, ...props }) => {
  const { dispatch } = useStoreon()
  const c = useStyles(props)
  return (
    <ReactModal
      className={classnames(className, c.Modal)}
      style={{
        overlay: {
          position: 'fixed',
          top: '6.125rem',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
      }}
      {...props}
    >
      <Button
        text
        className={c.Modal_CloseButton}
        onClick={() => dispatch('close-modal')}
      >
        <ExitIcon />
      </Button>
      <div className={c.Modal_Content}>{children}</div>
    </ReactModal>
  )
}

export default Modal
