export const getPreviousParts = formData => {
  return Object.keys(formData).reduce((acc, data) => {
    if (!formData[data].previousParts) return acc
    const newPrevArray = formData[data].previousParts
    return [...acc, ...newPrevArray]
  }, [])
}
