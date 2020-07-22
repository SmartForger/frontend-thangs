import { rgba, createColorShades } from './utils'

const WHITE = '#ffffff'
const GREY = '#dbdbdf'
const BLACK = '#33335C'
const YELLOW = '#ffbc00'
const BLUE = '#1cb2f5'
const BROWN = '#8b6400'
const RED = '#cc1e1e'

export const createTheme = (data = {}) => {
  const base = {
    colors: {
      white: createColorShades(WHITE),
      grey: createColorShades(GREY),
      black: createColorShades(BLACK),
      yellow: createColorShades(YELLOW),
      blue: createColorShades(BLUE),
      brown: createColorShades(BROWN),
      red: createColorShades(RED),
      error: '#ca2d2c',
    },
    typography: {
      mainFont: '"Montserrat", sans-serif',
      headerFont: 'Lexend Deca',
    },
    mediaQueries: {
      xs: '@media (min-width: 320px)',
      sm: '@media (min-width: 480px)',
      md: '@media (min-width: 640px)',
      lg: '@media (min-width: 1118px)',
      xl: '@media (min-width: 1235px)',
      xxl: '@media (min-width: 1440px)',
    },
    shadow: 'box-shadow: 0px 5px 10px 0px rgba(35, 37, 48, 0.25)',
  }

  return Object.keys(base).reduce(
    (obj, key) => {
      obj[key] = { ...base[key], ...obj[key] }
      return obj
    },
    { ...data }
  )
}
