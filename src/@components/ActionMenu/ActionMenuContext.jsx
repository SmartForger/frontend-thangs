import React from 'react'
import { useActionMenuProvider } from '@hooks'
import { MobileActionMenu } from '@components'

let ActionMenuContext
let { Provider } = (ActionMenuContext = React.createContext())

const ActionMenuProvider = ({ children }) => {
  const {
    setActionMenu,
    setActionMenuOpen,
    setActionMenuClose,
    setActionMenuData,
    ActionMenuComponent,
    actionMenuData,
    isActionMenuOpen,
  } = useActionMenuProvider()
  return (
    <Provider
      value={{
        setActionMenu,
        setActionMenuOpen,
        setActionMenuClose,
        setActionMenuData,
        ActionMenuComponent,
        actionMenuData,
        isActionMenuOpen,
      }}
    >
      <MobileActionMenu {...actionMenuData} />
      {children}
    </Provider>
  )
}

export { ActionMenuContext, ActionMenuProvider }
