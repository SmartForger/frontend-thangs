import React from 'react'
import { Tooltip as MuiTooltip } from '@material-ui/core'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => ({
  tooltip: {
    backgroundColor: '#F7F7FB !important',
    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.2)',
    color: `${theme.variables.colors.mainFontColor} !important`,
    fontSize: '16px !important',
    padding: '12px 16px !important',
    maxWidth: '382px !important'
  },
  arrow: {
    color: '#F7F7FB !important'
  }
}))

const Tooltip = props => {
  const c = useStyles()

  return <MuiTooltip arrow placement="top" classes={c} {...props} />
}

export default Tooltip
