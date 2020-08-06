import { useEffect } from 'react'
import useCommonStoreon from './useCommonStoreon'

export default (atomRawName, collectionName) => {
  const { dispatch, atom, getStoredAtom, operationParams } = useCommonStoreon(
    atomRawName,
    collectionName
  )

  useEffect(() => {
    if (!getStoredAtom().isLoading) {
      dispatch(...operationParams('fetch'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { dispatch, atom }
}
