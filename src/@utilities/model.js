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

export const getExternalAvatar = attributionUrl => {
  if (attributionUrl.includes('3delicious')) return '/assets/3delicious.png'
  if (attributionUrl.includes('3dmag')) return '/assets/3dmag.png'
  if (attributionUrl.includes('all3dfree')) return '/assets/all3dfree.png'
  if (attributionUrl.includes('archive3d')) return '/assets/archive3d.png'
  if (attributionUrl.includes('archibaseplanet')) return '/assets/archibase.png'
  if (attributionUrl.includes('gates')) return '/assets/gates.png'
  if (attributionUrl.includes('grainger')) return '/assets/grainger.png'
  if (attributionUrl.includes('halderusa')) return '/assets/halderusa.png'
  if (attributionUrl.includes('mcmaster')) return '/assets/mcmaster.png'
  if (attributionUrl.includes('myminifactory')) return '/assets/myminifactory.png'
  if (attributionUrl.includes('opengameart')) return '/assets/opengameart.png'
  if (attributionUrl.includes('parker')) return '/assets/parker.png'
  if (attributionUrl.includes('partcommunity')) return '/assets/partcommunity.png'
  if (attributionUrl.includes('prusaprinters')) return '/assets/prusaprinters.png'
  if (attributionUrl.includes('schaeffler')) return '/assets/schaeffler.png'
  if (attributionUrl.includes('sweethome3d')) return '/assets/sweethome3d.png'
  if (attributionUrl.includes('thingiverse')) return '/assets/thingiverse.png'
  if (attributionUrl.includes('youmagine')) return '/assets/youmagine.png'
}
