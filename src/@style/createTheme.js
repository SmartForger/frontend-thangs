import { colors } from './colors.js'
import * as textMixins from './text.js'

const fontIsLoaded = url => {
  const links = document.getElementsByTagName('link')
  if (!links.length) return false
  return [...links].some(item => item.href.includes(url))
}

const fontLoader = ({ url }) => {
  if (!fontIsLoaded(url)) {
    const head = document.getElementsByTagName('head')[0]
    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = url
    head.appendChild(link)
  }
}

const createTheme = (data = {}) => {
  const base = {
    colors,
    mixins: {
      text: textMixins,
    },
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

  fontLoader({
    url:
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap',
    family: '"Montserrat", sans-serif',
  })
  fontLoader({
    url:
      'https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@300;400;500;600;700&display=swap',
    family: 'Lexend Deca',
  })

  return Object.keys(base).reduce(
    (obj, key) => {
      obj[key] = { ...base[key], ...obj[key] }
      return obj
    },
    { ...data }
  )
}

export default createTheme
