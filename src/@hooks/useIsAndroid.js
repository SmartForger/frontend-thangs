import { useMemo } from 'react'
import * as UAParser from 'ua-parser-js'

export const useIsAndroid = () => {
  const isAndroid = useMemo(() => {
    const parser = new UAParser()
    return parser.getOS()?.name === 'Android'
  }, [])

  return isAndroid
}
