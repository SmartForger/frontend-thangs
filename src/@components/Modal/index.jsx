import React from 'react'
import ReactModal from 'react-modal'
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
  }
})
const noop = () => null
const Modal = ({ children, className, handleModalClose = noop, ...props }) => {
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
      <Button text className={c.Modal_CloseButton} onClick={handleModalClose}>
        <ExitIcon />
      </Button>
      {children}
    </ReactModal>
  )
}

export default Modal
