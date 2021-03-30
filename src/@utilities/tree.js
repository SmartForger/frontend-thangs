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

export const flattenTree = (nodes, childProp = 'subs') => {
  if (!nodes || nodes.length === 0) {
    return []
  }

  const addLevel = (node, level = 0) => {
    const newNode = { ...node, level }
    const subs = node[childProp]
      ? node[childProp].reduce(
          (arr, subnode) => [...arr, ...addLevel(subnode, level + 1)],
          []
        )
      : []
    delete newNode[childProp]
    newNode.hasChildren = subs.length > 0

    if (!newNode.id) {
      newNode.id = Math.random().toString().slice(2)
    }
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

    for (let i = 0; i < node.subs.length; i++) {
      const subnode = findNode(node.subs[i], name)
      if (subnode) {
        return subnode
      }
    }

    return null
  }

  return findNode({ subs: nodes }, name)
}

export const buildTree = (treeItems, idField = 'id', parentField = 'parentId') => {
  const rootItems = treeItems
    .filter(item => !item[parentField])
    .map(item => ({ ...item }))

  const addSubItems = node => {
    node.subs = treeItems
      .filter(item => item[parentField] === node[idField])
      .map(item => ({ ...item }))
    node.subs.forEach(subnode => {
      addSubItems(subnode)
    })
  }

  rootItems.forEach(root => {
    addSubItems(root)
  })

  return rootItems
}

export const arrayToDictionary = (data, idField = 'id') =>
  R.map(R.prop(0), R.groupBy(R.prop(idField), data))

export const buildPath = (dict, id, mapFunc, parentField = 'parentId') => {
  const path = [dict[id]]

  let item = dict[id]
  while (item && item[parentField]) {
    item = dict[item[parentField]]
    path.push(item)
  }

  const reverseMap = R.compose(R.map(mapFunc), R.reverse)
  return reverseMap(path)
}
