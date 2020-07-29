import React from 'react'
import ReactModal from 'react-modal'
import classnames from 'classnames'
import { createUseStyles } from '@style'

ReactModal.setAppElement('#root')

const useStyles = createUseStyles(theme => {
  return {
    Modal: {
      position: 'fixed',
      padding: '2.25rem 2rem 2rem',
      background: theme.colors.white[400],
      overflow: 'auto',
      borderRadius: '.5rem',
      outline: 'none',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: theme.variables.boxShadow,
    },
  }
})

const Modal = ({ children, className, ...props }) => {
  const c = useStyles(props)
  return (
    <ReactModal className={classnames(className, c.Modal)} {...props}>
      {children}
    </ReactModal>
  )
}

export default Modal
