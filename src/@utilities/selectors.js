export const getSubFolders = (folders, parentName) => {
  const nameReg = new RegExp(`^${parentName}\\/\\/[^\\/]+$`)
  return folders.filter(f => nameReg.test(f.name))
}
