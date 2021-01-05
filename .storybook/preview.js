import React from 'react'
import { ThemeProvider } from '@style'
import { addDecorator } from '@storybook/react'
import { GlobalStyles } from '@style/globals'
import { AppFrame } from '../src/App'

addDecorator(storyFn => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <div style={{ padding: '1rem' }}>{storyFn()}</div>
    </ThemeProvider>
  )
})
