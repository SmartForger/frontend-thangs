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
    const parentFolderIndex = R.findIndex(R.propEq('id', root.toString()))(oldFolders)
    newFolders[parentFolderIndex].subfolders.push(newFolder)
    return newFolders
  } else {
    newFolders.push(newFolder)
    return newFolders
  }
}

//Updates a folder in folders array
//If updateFolder has a root, it will replace the folder in the subfolders array of the root folder.
//If updateFolder has no root, it will replace the folder in the folders array.
export const updateFolder = (newFolder, oldFolders) => {
  const { id: folderId, root } = newFolder
  const newFolders = [...oldFolders]
  if (root) {
    newFolder.id = folderId
    const parentFolderIndex = R.findIndex(R.propEq('id', root.toString()))(newFolders)
    const subFolders = [...newFolders[parentFolderIndex].subfolders]
    newFolders[parentFolderIndex].subfolders = []
    subFolders.forEach(subfolder => {
      if (folderId.toString() === subfolder.id.toString()) {
        newFolders[parentFolderIndex].subfolders.push(newFolder)
      } else {
        newFolders[parentFolderIndex].subfolders.push(subfolder)
      }
    })
    return newFolders
  } else {
    newFolders.id = folderId.toString()
    const folderIndex = R.findIndex(R.propEq('id', folderId))(newFolders)
    newFolders[folderIndex] = newFolder
    return newFolders
  }
}

export const removeFolder = (folder, oldFolders) => {
  const { id: folderId, root } = folder
  const newFolders = [...oldFolders]
  if (root) {
    const parentFolderIndex = R.findIndex(R.propEq('id', root.toString()))(newFolders)
    const newSubfolders = newFolders[parentFolderIndex].subfolders
    newFolders[parentFolderIndex].subfolders = R.reject(
      folder => folder.id === folderId,
      newSubfolders
    )
    return newFolders
  } else {
    const folders = R.reject(folder => folder.id === folderId, newFolders)
    return folders
  }
}
