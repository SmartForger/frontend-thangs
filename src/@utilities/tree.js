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

export const flattenTree = nodes => {
  if (!nodes || nodes.length === 0) {
    return []
  }

  const addLevel = (node, level = 0) => {
    const newNode = { ...node, level }
    const subs = node.subs
      ? node.subs.reduce((arr, subnode) => [...arr, ...addLevel(subnode, level + 1)], [])
      : []
    return [newNode, ...subs]
  }

  return nodes.reduce((arr, node) => [...arr, ...addLevel(node)], [])
}

export const addPathBy = (nodes, field, parentPath = []) => {
  if (!nodes || nodes.length === 0) {
    return []
  }

  nodes.forEach(node => {
    if (!node.path) {
      node.path = {}
    }

    node.path[field] = [...parentPath, node[field]]

    if (node.subs && node.subs.length > 0) {
      addPathBy(node.subs, field, node.path[field])
    }
  })
}

export const findNodeByName = (nodes, name) => {
  const findNode = (node, name) => {
    if (node.name === name) {
      return node
    } else if (!node.subs) {
      return null
    }

    for (let i = 0; i < node.subs.length; i ++) {
      const subnode = findNode(node.subs[i], name)
      if (subnode) {
        return subnode
      }
    }

    return null
  }

  return findNode({ subs: nodes }, name)
}
