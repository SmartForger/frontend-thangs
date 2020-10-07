import { createUseStyles } from '@style'

const globals = theme => {
  return {
    '@global': {
      'html, body, #root': {
        height: '100%',
      },

      body: {
        '-moz-osx-font-smoothing': 'grayscale',
        '-webkit-font-smoothing': 'antialiased',
        padding: 0,
        margin: 0,
        overflowX: 'hidden',
        background: theme.variables.colors.backgroundColor,
        fontFamily: theme.variables.fonts.mainFont,
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

      '.ReactModal__Body--open': {
        overflow: 'hidden',
      },
    },
  }
}

const useGlobalStyles = createUseStyles(globals)

export const GlobalStyles = () => {
  useGlobalStyles()

  return null
}
