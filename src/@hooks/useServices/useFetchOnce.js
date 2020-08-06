import useCommonStoreon from './useCommonStoreon'

export default (atomRawName, collectionName) => {
  const { dispatch, atom, getStoredAtom, operationParams } = useCommonStoreon(
    atomRawName,
    collectionName
  )

  if (!getStoredAtom().isLoaded && !getStoredAtom().isLoading) {
    dispatch(...operationParams('fetch'))
  }

  return { dispatch, atom }
}
