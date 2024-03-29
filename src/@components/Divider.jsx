import React from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

const useStyles = createUseStyles(theme => {
  return {
    Divider: {
      margin: ({ spacing }) => `${spacing} 0`,
      border: 'none',
      borderTop: `1px solid ${theme.colors.white[600]}`,
    },
  }
})

const Divider = ({ spacing = '2rem' }) => {
  const c = useStyles({ spacing })
  return <hr className={c.Divider} />
}

export default Divider
