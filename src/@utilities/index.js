import * as R from 'ramda'

export * from './PhysnaServer'
export * from './ensureScriptIsLoaded'
export * from './swearjar.js'

/**
 * Receives Color Hex String: #FFFFFF
 * Returns RGB Int Array: [255, 255, 255]
 */
export const colorHexStringToRGBArray = colorStr =>
  colorStr
    .substring(1)
    .match(/.{1,2}/g)
    .map(tuple => parseInt(tuple, 16))

export const isProcessing = R.propEq('uploadStatus', 'PROCESSING')
export const isError = R.propEq('uploadStatus', 'ERROR')
export const isCompleted = R.propEq('uploadStatus', 'COMPLETED')
