import React, { useEffect, useMemo, useState } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ActionMenu } from '@components'
import { useActionMenu } from '@contexts/ActionMenu'

const useStyles = createUseStyles(_ => {
  return {
    ContextActionMenu: {
      position: 'fixed !important',
      zIndex: 999,
    },
  }
})

const noop = () => null

const TargetComponent = ({ onClick = noop, triggerOpen }) => {
  useEffect(() => {
    if (triggerOpen > 0) {
      onClick()
    }
    // eslint-disable-next-line
  }, [triggerOpen])

  return null
}

const ContextActionMenu = ({
  actionMenuTitle,
  alignItems = 'center',
  menuComponentProps,
  onChange = noop,
  options = [],
  menuId = '',
}) => {
  const c = useStyles()
  const [triggerOpen, setTriggerOpen] = useState(0)
  const { contextMenuData } = useActionMenu()
  const [menuPosition, setMenuPosition] = useState({
    left: 0,
    top: 0,
  })

  const menuProps = useMemo(() => {
    return {
      containerClassName: c.ContextActionMenu,
      onChange,
      actionBarTitle: actionMenuTitle,
      options,
      tabletLayout: false,
      alignItems,
      containerStyle: menuPosition,
      ...menuComponentProps,
    }
  }, [
    c,
    onChange,
    options,
    actionMenuTitle,
    alignItems,
    menuComponentProps,
    menuPosition,
  ])

  const targetComponentProps = useMemo(
    () => ({
      triggerOpen,
    }),
    [triggerOpen]
  )

  useEffect(() => {
    if (menuId && contextMenuData[menuId]) {
      const { x, y } = contextMenuData[menuId]
      setMenuPosition({
        left: x,
        top: y,
      })
      setTriggerOpen(n => n + 1)
    }
  }, [contextMenuData, menuId])

  return (
    <ActionMenu
      MenuComponentProps={menuProps}
      TargetComponent={TargetComponent}
      TargetComponentProps={targetComponentProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ContextActionMenu
