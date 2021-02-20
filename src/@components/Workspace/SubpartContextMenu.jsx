import React from 'react'
import { connectMenu, ContextMenu } from 'react-contextmenu'
import { createUseStyles } from '@style'
import SubpartMenu from './SubpartMenu'

const useStyles = createUseStyles(() => {
  return {
    ContextMenu: {
      zIndex: '2',
    },
  }
})

const SubpartContextMenu = props => {
  const c = useStyles({})

  const { trigger } = props
  const { part } = trigger || {}

  return (
    <ContextMenu className={c.ContextMenu} id={'Subpart_Menu'}>
      {part ? <SubpartMenu part={part} /> : <div />}
    </ContextMenu>
  )
}

export default connectMenu('Subpart_Menu')(SubpartContextMenu)
