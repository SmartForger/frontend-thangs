import * as R from 'ramda'

export const checkTreeLoading = node => {
  return (
    node.isLoading || (node.subs && node.subs.some(subnode => checkTreeLoading(subnode)))
  )
}

export const checkTreeMissing = node => {
  return (
    (!node.valid && !node.skipped) ||
    (node.subs && node.subs.some(subnode => checkTreeMissing(subnode)))
  )
}

export const findNodesByPath = (nodes, path) => {
  if (path.length > 0) {
    const node = nodes.find(n => n.name === path[0])
    return node.subs && path.length > 1
      ? [node, ...findNodesByPath(node.subs, path.slice(1))]
      : [node]
  }

  return []
}

export const getAssemblyTreePayload = (nodes, uploadedFiles) => {
  if (!nodes || nodes.length === 0) {
    return []
  }

  const allFiles = R.indexBy(R.prop('newFileName'), R.values(uploadedFiles))

  const checkNode = node => {
    const fileNode = { ...allFiles[node.name] }
    if (node.subs) {
      fileNode.subs = node.subs.map(checkNode)
    }
  }

  return nodes.map(checkNode)
}
