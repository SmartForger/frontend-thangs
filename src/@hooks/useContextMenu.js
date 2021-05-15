import { useActionMenu } from '@contexts/ActionMenu'
import { useEffect } from 'react'

const useContextMenu = (triggerRef, menuId, data = null) => {
  const { setContextMenuData } = useActionMenu()

  useEffect(() => {
    const element = triggerRef.current
    const contextMenuHandler = ev => {
      ev.stopPropagation()
      ev.preventDefault()
      // console.log(111, 'context menu open', menuId)
      setContextMenuData(menuId, {
        x: ev.pageX,
        y: ev.pageY,
        data,
      })
    }

    if (element) {
      element.addEventListener('contextmenu', contextMenuHandler)
      // console.log(111, 'register contextmenu handler')
    }

    return () => {
      if (element) {
        element.removeEventListener('contextmenu', contextMenuHandler)
        // console.log(111, 'remove contextmenu handler')
      }
    }
  }, [triggerRef, menuId, data, setContextMenuData])
}

export default useContextMenu
