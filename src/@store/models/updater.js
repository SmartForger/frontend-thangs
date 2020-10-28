import * as R from 'ramda'

export const removeModel = (model, oldModels) => {
  const { id } = model
  const newModels = [...oldModels]
  return R.reject(model => model.id === id, newModels)
}

export const updateLike = (updatedModel, state, userId, isLiked) => {
  const { id } = updatedModel
  const newModel = { ...updatedModel }
  const oldLikes = R.pathOr({}, [`user-liked-models-${userId}`, 'data'], state)
  const newLikes = { ...oldLikes }
  if (!newLikes.models) newLikes.models = []
  const newLikedModels = R.path(['models'], newLikes)
  if (isLiked) {
    if (!R.find(R.propEq('id', id.toString()))(newLikedModels)) {
      newModel.likes = [...newModel.likes, parseInt(userId)]
      newLikes.models.push(newModel)
    }
  } else {
    newLikes.models = newLikedModels.filter(model => model.id !== id)
  }
  return newLikes
}
