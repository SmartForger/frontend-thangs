import * as R from 'ramda'

const filterFoldersDict = R.compose(R.values, R.filter)
const eqParent = R.propEq('parentId')
const isShared = R.propEq('shared', true)
const isNotShared = R.complement(isShared)
const hasNoParent = R.compose(R.isNil, R.prop('parentId'))

export const getSubFolders = (foldersDict, folderId) =>
  filterFoldersDict(eqParent(folderId), foldersDict)

export const getSharedFolders = foldersDict => filterFoldersDict(isShared, foldersDict)

export const getMyFolders = foldersDict => filterFoldersDict(isNotShared, foldersDict)

export const getRootFolders = foldersDict => filterFoldersDict(hasNoParent, foldersDict)
