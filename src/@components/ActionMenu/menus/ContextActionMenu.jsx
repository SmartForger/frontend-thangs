import React, { useEffect, useMemo, useState } from 'react'
import { createUseStyles } from '@physna/voxel-ui/@style'

import { ActionMenu } from '@components'

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
}) => {
  const c = useStyles()
  const [menuElement, setMenuElement] = useState(null)
  const [triggerOpen, setTriggerOpen] = useState(0)
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
    if (!menuElement) {
      return
    }

    const container = menuElement.parentElement

    const contextMenuHandler = ev => {
      ev.preventDefault()
      ev.stopPropagation()
      setTriggerOpen(n => n + 1)
      setMenuPosition({
        left: ev.pageX,
        top: ev.pageY,
      })
    }

    if (container) {
      container.addEventListener('contextmenu', contextMenuHandler)
    }

    return () => {
      if (container) {
        container.removeEventListener('contextmenu', contextMenuHandler)
      }
    }
  }, [menuElement])

  return (
    <ActionMenu
      setContainerRef={setMenuElement}
      MenuComponentProps={menuProps}
      TargetComponent={TargetComponent}
      TargetComponentProps={targetComponentProps}
      isCloseOnSelect={true}
      isMobileOnly={true}
    />
  )
}

export default ContextActionMenu
