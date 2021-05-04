import { createContext, useContext } from 'react'

export const ActionMenuContext = createContext()

export const useActionMenu = () => useContext(ActionMenuContext)
