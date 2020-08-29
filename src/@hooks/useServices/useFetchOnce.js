import useCommonStoreon from './useCommonStoreon'

export default (atomRawName, collectionName) => {
  const { dispatch, atom, getStoredAtom, getEventParams } = useCommonStoreon(
    atomRawName,
    collectionName
  )

  if (!getStoredAtom().isLoaded && !getStoredAtom().isLoading) {
    dispatch(...getEventParams('fetch'))
  }

  return { dispatch, atom }
}
