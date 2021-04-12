import * as R from 'ramda'

export * from './analytics'
export * from './PhysnaServer'
export * from './ensureScriptIsLoaded'
export * from './tree'
export * from './model'
export * from './selectors'

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
  if (x === undefined || x === null) return undefined
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
  const sizes = ['bytes', 'kb', 'mb', 'gb', 'tb', 'pb', 'eb', 'zb', 'yb']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const isIOS = () => {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes((navigator && navigator.platform) || []) ||
    // iPad on iOS 13 detection
    (navigator &&
      navigator.userAgent &&
      navigator.userAgent.includes('Mac') &&
      'ontouchend' in document)
  )
}
