/**
 * Receives Color Hex String: #FFFFFF
 * Returns RGB Int Array: [255, 255, 255]
 */
export const colorHexStringToRGBArray = colorStr =>
  colorStr
    .substring(1)
    .match(/.{1,2}/g)
    .map(tuple => parseInt(tuple, 16))
