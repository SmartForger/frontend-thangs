import { useMemo } from 'react'
import * as UAParser from 'ua-parser-js'

export const useIsIOS = () => {
  const isIOS = useMemo(() => {
    const parser = new UAParser()
    return parser.getOS()?.name === 'iOS'
  }, [])

  return isIOS
}
