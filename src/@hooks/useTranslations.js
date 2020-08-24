import { useMemo } from 'react'
import translations from '@constants/translations'
import * as R from 'ramda'

const get = key => R.pathOr(key, R.split('.', key))

export const getTranslatorFn = translations => (...args) => {
  let key = args[0]
  return get(key)(translations)
}

const useTranslations = ({ language = 'en' }) => {
  const { data } = translations.en
  return useMemo(() => getTranslatorFn(data), [data])
}

export default useTranslations
