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

  return id
    ? {
      ...oldFolders,
      [id]: newFolder,
    }
    : oldFolders
}

//Updates a folder in folders array
//If updateFolder has a root, it will replace the folder in the subfolders array of the root folder.
//If updateFolder has no root, it will replace the folder in the folders array.
export const updateFolder = (newFolder = {}, oldFolders) => {
  const { id } = newFolder
  return id
    ? {
      ...oldFolders,
      [id]: newFolder,
    }
    : oldFolders
}

export const updateLike = (folderId, state, userId, isLiked) => {
  const updatedFolder = state.folders.data[folderId] || {}
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
  const { id: folderId } = folder
  const newFolders = { ...oldFolders }
  delete newFolders[folderId]
  return newFolders
}
