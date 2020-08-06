import { NewTheme, NewDarkTheme } from '@style/themes'

const usePageTheming = location => {
  const { pathname } = location
  const darkThemePages = ['/login', '/password_reset', '/signup']
  if (darkThemePages.some(darkPage => pathname.includes(darkPage))) return NewDarkTheme
  return NewTheme
}

export default usePageTheming
