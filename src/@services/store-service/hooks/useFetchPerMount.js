import { useEffect, useContext } from 'react'
import { StoreContext, useStoreon } from 'storeon/react'

export default function(atomRawName, collectionName) {
  const atomName = collectionName ? `${collectionName}-${atomRawName}` : atomRawName

  const { dispatch, ...atoms } = useStoreon(atomName)
  const store = useContext(StoreContext)
  const getStored = name => store.get()[name]

  if (!getStored(atomName)) {
    dispatch(`init-${collectionName}`, { id: atomRawName })
  }

  const atom = atoms[atomName] ? atoms[atomName] : getStored(atomName)

  useEffect(() => {
    if (!getStored(atomName).isLoading) {
      dispatch(`fetch-${collectionName}`, { id: atomRawName })
    }
  }, [])

  return { dispatch, atom }
}
