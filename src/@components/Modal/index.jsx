import ReactModal from 'react-modal'
import { createUseStyles } from '@style'

ReactModal.setAppElement('#root')

const useStyles = createUseStyles(theme => {
  return {
    ReactModal: {
      position: 'fixed',
      padding: '2.5rem 4rem 4rem',
      background: theme.colors.WHITE_1,
      overflow: 'auto',
      borderRadius: '.5rem',
      outline: 'none',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      ...theme.shadow,
    },
  }
})

export const ReactModal = props => {
  const c = useStyles(props)
  return <div className={c.ReactModal}></div>
}
