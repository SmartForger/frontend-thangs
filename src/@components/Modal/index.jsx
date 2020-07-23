import React from 'react'
import ReactModal from 'react-modal'
import { createUseStyles } from '@style'

ReactModal.setAppElement('#root')

const useStyles = createUseStyles(theme => {
  return {
    Modal: {
      position: 'fixed',
      padding: '2.5rem 4rem 4rem',
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

const Modal = props => {
  const c = useStyles(props)
  return <ReactModal className={c.Modal}></ReactModal>
}

export default Modal
