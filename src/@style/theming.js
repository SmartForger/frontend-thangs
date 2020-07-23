import React from 'react'
import { createTheming, createUseStyles as jssCreateUseStyles } from 'react-jss'
import { createTheme } from './theme'

export const defaultTheme = createTheme()
const ThemeContext = React.createContext(defaultTheme)
const theming = createTheming(ThemeContext)

export const ThemeProvider = props => {
  const { children, theme = defaultTheme } = props

  return <theming.ThemeProvider theme={theme}>{children}</theming.ThemeProvider>
}

export const useTheme = theming.useTheme

export const createUseStyles = (...args) => {
  return jssCreateUseStyles(...args, { theming })
}
