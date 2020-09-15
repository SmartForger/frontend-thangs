import React from 'react'
import { ThemeProvider } from '@style'
import { addDecorator } from '@storybook/react'
import { GlobalStyles } from '@style/globals'
import { NewTheme } from '@style/themes'
import { AppFrame } from '../src/App'

addDecorator(storyFn => {
  return (
    <AppFrame>
      <ThemeProvider theme={NewTheme}>
        <GlobalStyles />
        <div style={{ padding: '1rem' }}>{storyFn()}</div>
      </ThemeProvider>
    </AppFrame>
  )
})
