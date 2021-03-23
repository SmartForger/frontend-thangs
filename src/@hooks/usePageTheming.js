import { NewTheme, NewDarkTheme } from '@physna/voxel-ui/@style'

const usePageTheming = location => {
  const { pathname } = location
  const darkThemePages = ['/login', '/password-reset', '/signup']
  if (darkThemePages.some(darkPage => pathname.includes(darkPage))) return NewDarkTheme
  return NewTheme
}

export default usePageTheming
