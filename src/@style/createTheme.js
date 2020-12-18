import { colors } from './colors.js'
import * as textMixins from './text.js'

const createTheme = (data = {}) => {
  const base = {
    colors,
    text: textMixins,
    mediaQueries: {
      xs: '@media (min-width: 320px)',
      xs_352: '@media (min-width: 352px)',
      sm: '@media (min-width: 480px)',
      md: '@media (min-width: 640px)',
      md_viewer: '@media (min-width: 842px)',
      md_972: '@media (min-width: 972px)',
      lg: '@media (min-width: 1118px)',
      xl: '@media (min-width: 1235px)',
      xxl: '@media (min-width: 1440px)',
      xxl_1454: '@media (min-width: 1454px)',
      xxxl: '@media (min-width: 1616px)',
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
