import * as R from 'ramda'

export * from './PhysnaServer'
export * from './ensureScriptIsLoaded'

/**
 * Receives Color Hex String: #FFFFFF
 * Returns RGB Int Array: [255, 255, 255]
 */
export const colorHexStringToRGBArray = colorStr =>
  colorStr
    .substring(1)
    .match(/.{1,2}/g)
    .map(tuple => parseInt(tuple, 16))

export const numberWithCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const truncateString = (str, length) => {
  if (str && str.length > length) {
    return str.slice(0, length) + '...'
  } else {
    return str
  }
}

export const isProcessing = R.propEq('uploadStatus', 'PROCESSING')
export const isError = R.propEq('uploadStatus', 'ERROR')
export const isCompleted = R.propEq('uploadStatus', 'COMPLETED')

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
