import { useEffect, useContext, useCallback } from 'react'
import { StoreContext, useStoreon } from 'storeon/react'

export default function(atomRawName, collectionName) {
  const atomName = collectionName ? `${collectionName}-${atomRawName}` : atomRawName

  const { dispatch, ...atoms } = useStoreon(atomName)
  const store = useContext(StoreContext)
  const getStored = useCallback(name => store.get()[name], [store])

  if (!getStored(atomName)) {
    dispatch(`init-${collectionName}`, { id: atomRawName })
  }

  const atom = atoms[atomName] ? atoms[atomName] : getStored(atomName)

  useEffect(() => {
    if (!getStored(atomName).isLoading) {
      dispatch(`fetch-${collectionName}`, { id: atomRawName })
    }
  }, [atomName, atomRawName, collectionName, dispatch, getStored])

  return { dispatch, atom }
}
