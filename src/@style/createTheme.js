import { colors } from './colors.js'
import * as textMixins from './text.js'

const createTheme = (data = {}) => {
  const base = {
    colors,
    text: textMixins,
    mediaQueries: {
      xs: '@media (min-width: 320px)',
      sm: '@media (min-width: 480px)',
      md: '@media (min-width: 640px)',
      lg: '@media (min-width: 1118px)',
      xl: '@media (min-width: 1235px)',
      xxl: '@media (min-width: 1440px)',
    },
    variables: {},
  }

  return Object.keys(base).reduce(
    (obj, key) => {
      obj[key] = { ...base[key], ...obj[key] }
      return obj
    },
    { ...data }
  )
}

export default createTheme
