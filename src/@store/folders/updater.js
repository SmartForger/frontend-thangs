import * as R from 'ramda'

export const createNewFolders = (newFolderData, oldFolders) => {
  const { id, name, isPublic, root, currentUser } = newFolderData
  const newFolder = {
    id,
    name,
    creator: { ...currentUser },
    members: [{ ...currentUser }],
    models: [],
    subfolders: [],
    root,
    description: null,
    likes: [],
    pending: [],
    likesCount: '0',
    isPublic,
  }
  const newFolders = [...oldFolders]

  if (root) {
    const parentFolderIndex = R.findIndex(R.propEq('id', root))(oldFolders)
    newFolders[parentFolderIndex].subfolders.push(newFolder)
    return newFolders
  } else {
    newFolders.push(newFolder)
    return newFolders
  }
}

export const updateRootFolder = (folderId, newFolder, oldFolders) => {
  const newFolders = [...oldFolders]
  const folderIndex = R.findIndex(R.propEq('id', folderId))(newFolders)
  newFolders[folderIndex] = newFolder
  return newFolders
}
