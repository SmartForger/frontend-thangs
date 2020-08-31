import en from './en.json'

const map = {
  en,
}

const translations = Object.keys(map).reduce((acc, key) => {
  acc[key] = {
    data: map[key],
  }
  return acc
}, {})

export default translations
