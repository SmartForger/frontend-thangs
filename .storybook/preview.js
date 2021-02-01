import React from 'react'
import { ThemeProvider, createUseStyles } from '@style'
import { addDecorator } from '@storybook/react'
import { GlobalStyles } from '@style/globals'

const useStyles = createUseStyles(theme => {
  return {
    Container: {
      paddingTop: '6rem',
      display: 'flex',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: theme.colors.blue[200],
    },
  }
})

addDecorator(storyFn => {
  const c = useStyles({})

  return (
    <ThemeProvider>
      <GlobalStyles />
      <div className={c.Container}>{storyFn()}</div>
    </ThemeProvider>
  )
})
