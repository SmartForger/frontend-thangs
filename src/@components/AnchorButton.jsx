import React from 'react'
import { linkText } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    AnchorButton: {
      ...linkText,
      margin: 0,
      padding: 0,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
  }
})

export const AnchorButton = props => {
  const c = useStyles(props)
  return <button className={c.AnchorButton}></button>
}
