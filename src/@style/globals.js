import { createUseStyles } from '@style'

export const useGlobalStyles = createUseStyles(theme => {
  return {
    '@global': {
      body: {
        '-moz-osx-font-smoothing': 'grayscale',
        '-webkit-font-smoothing': 'antialiased',
        padding: 0,
        margin: 0,
        overflowX: 'hidden',
        background: theme.variables.colors.backgroundColor,
        fontFamily: theme.variables.colors.buttonFont,
        fontSize: '.875rem',
        color: theme.variables.colors.mainFontColor || theme.colors.grey[700],
      },

      a: {
        textDecoration: 'none',
        fontWeight: 500,
        color: theme.variables.colors.linkText,
      },

      'h1, h2, h3, h4, h5, h6': {
        margin: 0,
        fontWeight: 'inherit',
      },

      'input, button, textarea': {
        fontSize: 'inherit',
        fontFamily: 'inherit',
      },

      'ol, ul': {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
      },

      '.ReactModal__Overlay': {
        zIndex: 2,
      },
    },
  }
})
