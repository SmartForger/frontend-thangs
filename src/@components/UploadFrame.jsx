import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    UploadFrame: {
      height: '35rem',
      backgroundColor: ({ dragactive }) =>
        dragactive ? theme.color.white[5] : theme.color.white[1],
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      cursor: ({ currentFile }) => (currentFile ? 'auto' : 'pointer'),
    },
  }
})

export const UploadFrame = props => {
  const c = useStyles(props)
  return <div className={c.UploadFrame}></div>
}
