import React from 'react'
import { MemoryRouter } from 'react-router'
import { ThemeProvider, createUseStyles } from '@style'
import { addDecorator } from '@storybook/react'
import { GlobalStyles } from '@style/globals'

const useStyles = createUseStyles(theme => {
  return {
    Description: {
      position: 'absolute',
      top: 50,
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
    },
    Container: {
      display: 'flex',
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.blue[200],
    },
  }
})

addDecorator(storyFn => {
  const c = useStyles({})

  return (
    <ThemeProvider>
      <GlobalStyles />
      <MemoryRouter>
        <div className={c.Description}>
          To change viewport (mobile, desktop) please choose menu "Change the size over
          preview"
        </div>
        <div className={c.Container}>{storyFn()}</div>
      </MemoryRouter>
    </ThemeProvider>
  )
})
