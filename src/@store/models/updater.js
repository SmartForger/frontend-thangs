import * as R from 'ramda'

export const removeModel = (model, oldModels) => {
  const { id } = model
  const newModels = [...oldModels]
  return R.reject(model => model.id === id, newModels)
}
