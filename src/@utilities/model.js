import * as R from 'ramda'
import * as path from 'path'

const THUMBNAILS_FOLDER = process.env.REACT_APP_THUMBNAILS_FOLDER
const THUMBNAILS_HOST = process.env.REACT_APP_THUMBNAILS_HOST
const REACT_APP_MODEL_BUCKET = process.env.REACT_APP_MODEL_BUCKET

export const buildThumbnailUrl = (model, useThumbnailer) => {
  if (model.fullThumbnailUrl) return model.fullThumbnailUrl
  if (model.thumbnailUrl) return model.thumbnailUrl
  let modelUri = useThumbnailer
    ? `${THUMBNAILS_HOST}${getThumbnailUrl(model)}`
    : `${REACT_APP_MODEL_BUCKET}${getThumbnailUrl(model)}`
  if (useThumbnailer) return modelUri
  return modelUri.replace(/\s/g, '_').replace(path.extname(modelUri), '.png')
}

const getThumbnailUrl = (model = {}) => {
  const {
    parts,
    filename,
    modelFileName,
    newFileName,
    thumbnailUrl,
    uploadedFile,
  } = model
  let primaryPart
  //This should be the the most common case for model cards
  if (filename) return filename
  if (thumbnailUrl) return `${THUMBNAILS_FOLDER}${thumbnailUrl}`
  //This is used by the Search By Model overlay for generating the "scanner" thumbnail
  if (uploadedFile) return `${uploadedFile}`
  if (modelFileName) return encodeURIComponent(modelFileName)
  if (parts) {
    if (parts.length > 1) {
      primaryPart = R.find(R.propEq('isPrimary', true))(parts) || parts[0]
    } else {
      primaryPart = parts[0]
    }
    return primaryPart.filename
  }
  //This is used by the model uploader to generate small thumbnails in the "Enter Part Info" overlay
  if (newFileName) {
    if (newFileName.includes(THUMBNAILS_FOLDER)) {
      return encodeURIComponent(newFileName)
    } else {
      return `${THUMBNAILS_FOLDER}${encodeURIComponent(newFileName)}`
    }
  }
  return 'unknown'
}
