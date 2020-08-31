import { useContext, useCallback } from 'react'
import { StoreContext, useStoreon } from 'storeon/react'

const getOperationParams = (atomRawName, collectionName, operation) => {
  if (collectionName) {
    return [`${operation}-${collectionName}`, { id: atomRawName }]
  } else {
    return [`${operation}-${atomRawName}`]
  }
}

export default (atomRawName, collectionName) => {
  const atomName = collectionName ? `${collectionName}-${atomRawName}` : atomRawName

  const { dispatch, ...atoms } = useStoreon(atomName)
  const store = useContext(StoreContext)
  const getStoredAtom = useCallback(() => store.get()[atomName], [store, atomName])

  const getEventParams = operation =>
    getOperationParams(atomRawName, collectionName, operation)

  if (!getStoredAtom()) {
    dispatch(...getEventParams('init'))
  }

  const atom = atoms[atomName] ? atoms[atomName] : getStoredAtom()

  return { dispatch, atom, getStoredAtom, getEventParams }
}
