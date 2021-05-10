import React, { useMemo, useReducer } from 'react'
import { MobileActionMenu } from '@components'
import { ActionMenuContext } from './ActionMenu'

const useActionMenuProvider = () => {
  const [actionMenu, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case 'all':
          return { ...state, ...action.payload }
        case 'open':
          return { ...state, isOpen: action.payload }
        case 'data':
          return { ...state, data: action.payload }
        default:
          return state
      }
    },
    { isOpen: false, Component: null, data: {} }
  )

  const setActionMenu = actionMenuObj => {
    dispatch({
      type: 'all',
      payload: actionMenuObj,
    })
  }

  const setActionMenuOpen = () => {
    dispatch({
      type: 'open',
      payload: true,
    })
  }

  const setActionMenuClose = () => {
    dispatch({
      type: 'open',
      payload: false,
    })
  }

  const setActionMenuData = data => {
    dispatch({
      type: 'data',
      payload: data,
    })
  }

  const ActionMenuComponent = useMemo(() => {
    return (actionMenu.isOpen && actionMenu.Component) || null
  }, [actionMenu])

  return {
    setActionMenu,
    setActionMenuOpen,
    setActionMenuClose,
    setActionMenuData,
    ActionMenuComponent,
    actionMenuData: actionMenu.data,
    isActionMenuOpen: actionMenu.isOpen,
  }
}

export const ActionMenuProvider = ({ children }) => {
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
    <ActionMenuContext.Provider
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
    </ActionMenuContext.Provider>
  )
}