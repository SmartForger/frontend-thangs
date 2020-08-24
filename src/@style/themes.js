import { colors } from './colors.js'

const fontMain = '"Montserrat", sans-serif'
const boxShadow = '0px 5px 10px 0px rgba(35, 37, 48, 0.25)'
const headerFont = 'Lexend Deca'

const maxWidth = '1440px'
export const NewTheme = {
  variables: {
    colors: {
      backgroundColor: colors.white[900],
      cardBackground: colors.white[400],
      errorTextColor: colors.error,
      errorTextBackground: colors.errorBackground,
      flashColor: colors.purple[400],
      linkText: colors.blue[500],
      mainFontColor: colors.grey[700],
      textInputBackground: colors.white[800],
      textInputColor: colors.grey[700],
      textInputPlaceholderColor: colors.grey[300],
      uploaderText: colors.purple[300],
      viewerText: colors.grey[500],
      viewerControlBorderColor: colors.purple[200],
      viewerControlText: colors.grey[300],
    },
    fonts: {
      headerFont,
      mainFont: fontMain,
    },
    maxWidth,
    boxShadow,
  },
}

export const NewDarkTheme = {
  ...NewTheme,
  variables: {
    ...NewTheme.variables,
    colors: {
      ...NewTheme.variables.colors,
      backgroundColor: colors.purple[900],
      linkText: colors.blue[300],
      mainFontColor: colors.grey[300],
      textInputBackground: colors.white[900],
    },
  },
}
