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
export const updateFolder = (newFolder = {}, oldFolders) => {
  const { id: folderId, root } = newFolder
  const newFolders = [...oldFolders]
  if (root) {
    newFolder.id = folderId
    const parentFolderIndex = R.findIndex(R.propEq('id', root.toString()))(newFolders)
    const subFolders = [...newFolders[parentFolderIndex].subfolders]
    newFolders[parentFolderIndex].subfolders = []
    subFolders.forEach(subfolder => {
      if (subfolder.id && subfolder.id.toString() === folderId.toString()) {
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

const findFolderById = (id, folders = []) => {
  const rootFolder = R.find(R.propEq('id', id.toString()))(folders) || {}
  if (!R.isEmpty(rootFolder)) return rootFolder
  let subFolder = false
  folders.some(folder => {
    const subfolders = folder.subfolders || []
    subFolder = R.find(R.propEq('id', id.toString()))(subfolders) || false
    return subFolder
  })
  return subFolder
}

export const updateLike = (folderId, state, userId, isLiked) => {
  const allFolders = [...state.folders.data, ...state.shared.data]
  const updatedFolder = findFolderById(folderId, allFolders)
  const oldLikes = state[`user-liked-models-${userId}`].data
  const newLikes = { ...oldLikes }

  if (isLiked) {
    if (
      newLikes.folders &&
      newLikes.folders.length &&
      updatedFolder &&
      updatedFolder.id &&
      !R.find(R.propEq('id', updatedFolder.id.toString()))(newLikes.folders)
    ) {
      updatedFolder.likes = [...updatedFolder.likes, parseInt(userId)]
      newLikes.folders.push(updatedFolder)
    }
  } else {
    newLikes.folders = newLikes.folders.filter(folder => folder.id !== updatedFolder.id)
  }
  return newLikes
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

export const removeModelFromFolder = (model, oldFolders) => {
  const { id: modelId } = model
  const newFolders = [...oldFolders]
  return newFolders.map(rootFolder => {
    const { subfolders } = rootFolder
    const newRootFolder = { ...rootFolder }
    newRootFolder.models = R.reject(model => model.id === modelId, rootFolder.models)
    newRootFolder.subfolders = subfolders.map(subfolder => {
      const newSubFolder = { ...subfolder }
      newSubFolder.models = R.reject(model => model.id === modelId, subfolder.models)
      return newSubFolder
    })
    return newRootFolder
  })
}
