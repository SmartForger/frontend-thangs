import { NewTheme, NewDarkTheme } from '@style/themes'

export const usePageTheming = location => {
  const { pathname } = location
  switch (pathname) {
    case '/login':
    case '/password_reset':
    case '/signup':
      return NewDarkTheme
    default:
      return NewTheme
  }
}
