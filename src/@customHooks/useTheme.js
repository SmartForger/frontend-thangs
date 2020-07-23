import { NewTheme, NewDarkTheme } from '@style/themes'

const useTheme = path => {
  console.log(path)
  switch (path) {
    case '/login':
    case '/password_reset':
    case '/signup':
      return NewDarkTheme
    default:
      return NewTheme
  }
}

export default useTheme
