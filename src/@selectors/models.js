export const getFolderModels = (models, folderId) =>
  models.filter(model => model.folderId === folderId)
