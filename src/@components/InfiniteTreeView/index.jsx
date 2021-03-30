import React, { useState, useMemo, useCallback, useRef, memo } from 'react'
import { FixedSizeList, areEqual } from 'react-window'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import { ReactComponent as IndentArrow } from '@svg/icon-indent-arrow.svg'
import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'

const useStyles = createUseStyles(_theme => {
  return {
    TreeNode: {
      boxSizing: 'border-box',
      display: 'flex',
      overflow: 'hidden',
      alignItems: 'center',
    },
    TreeNode_ExpandIcon: {
      width: '0.75rem',
      cursor: 'pointer',
      marginRight: '0.75rem',
      '& svg': {
        display: 'block',
        margin: 'auto',
        transition: 'transform 150ms ease-in-out',
      },
    },
    TreeNode_ExpandIcon__expanded: {
      '& svg': {
        transform: 'rotate(90deg)',
      },
    },
  }
})

const Row = memo(({ data, index, style }) => {
  const { items, isSelected, levelPadding, classes, renderNode, toggleNode } = data
  const node = items[index]

  return (
    <div
      className={classnames(classes.TreeNode, classes.item, {
        [classes.itemSelected]: isSelected(node),
      })}
      style={{
        ...style,
        paddingLeft: levelPadding * node.level,
      }}
    >
      {node.level > 0 && (
        <div
          className={classnames(classes.TreeNode_ExpandIcon, {
            [classes.TreeNode_ExpandIcon__expanded]: !node.isLeaf && !node.closed,
          })}
          onClick={() => toggleNode(node)}
        >
          {node.isLeaf ? <IndentArrow /> : <ArrowRight />}
        </div>
      )}
      {renderNode(node)}
    </div>
  )
}, areEqual)
Row.displayName = 'InfiniteTreeRowComponent'

const isLeaf = (nodes, i) => {
  return !nodes[i + 1] || nodes[i + 1].level <= nodes[i].level
}

const findParentIndex = (nodes, index) => {
  const parentLevel = nodes[index].level - 1
  if (parentLevel < 0) {
    return -1
  }

  for (let j = index - 1; j >= 0; j--) {
    if (nodes[j].level === parentLevel) {
      return j
    }
  }

  return -1
}

const InfiniteTreeView = ({
  classes,
  nodes,
  renderNode,
  itemHeight,
  width,
  maxHeight,
  levelPadding = 40,
  scrollToItem,
  isSelected = () => false,
}) => {
  const [expandedNodes, setExpandedNodes] = useState([])
  const prevScrollToItem = useRef({})
  const c = useStyles()
  const listRef = useRef()

  const toggleNode = useCallback(node => {
    setExpandedNodes(expanded => {
      const index = expanded.indexOf(node.id)
      if (index >= 0) {
        expanded.splice(index, 1)
      } else {
        expanded.push(node.id)
      }
      return expanded.slice()
    })
  }, [])

  const filteredNodes = useMemo(() => {
    const newNodes = []
    let lastLevel = nodes.length
    const hasMultiRoots = nodes.filter(node => node.level === 0).length > 1

    let shouldScroll = false
    if (scrollToItem && scrollToItem.id) {
      let shouldUpdateExpanded = false

      const index = nodes.findIndex(node => node.id === scrollToItem.id)
      if (index >= 0) {
        let parentIndex = findParentIndex(nodes, index)
        while (parentIndex >= 0) {
          const parent = nodes[parentIndex]
          if (!expandedNodes.includes(parent.id)) {
            expandedNodes.push(parent.id)
            shouldUpdateExpanded = true
          }
          parentIndex = findParentIndex(nodes, parentIndex)
        }
      }

      if (shouldUpdateExpanded) {
        setExpandedNodes(expandedNodes.slice())
      }

      shouldScroll = true
      prevScrollToItem.current = scrollToItem
    }

    nodes.forEach((node, i) => {
      if (node.level <= lastLevel) {
        const { parts: _p, ...newNode } = node
        newNode.isLeaf = isLeaf(nodes, i)
        if ((node.level > 0 || hasMultiRoots) && !expandedNodes.includes(node.id)) {
          lastLevel = node.level
          newNode.closed = true
        } else {
          lastLevel = nodes.length
        }
        newNodes.push(newNode)
      }
    })

    if (shouldScroll && listRef.current) {
      const index = newNodes.findIndex(node => node.id === scrollToItem.id)
      if (index >= 0) {
        setTimeout(() => {
          listRef.current.scrollToItem(index)
        })
      }
    }

    return newNodes
    // Passing listRef.current in the deps here is intentional (albeit not recommended) so that we can scroll to a highlighted item on the initial render
    // Eventually we should refactor the scrolling and tree building logic out of filteredNodes so that we can call scroll when the ref is set instead of relying on the useMemo to update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, expandedNodes, scrollToItem, listRef.current])

  const explorerHeight = filteredNodes.length * itemHeight
  const height = Math.min(explorerHeight, maxHeight)

  const itemData = useMemo(() => {
    return {
      items: filteredNodes,
      toggleNode,
      renderNode,
      classes: { ...c, ...classes },
      levelPadding,
      isSelected,
    }
  }, [filteredNodes, toggleNode, renderNode, levelPadding, isSelected, c, classes])

  return (
    <FixedSizeList
      ref={listRef}
      className={classes.root}
      width={width}
      height={height}
      itemData={itemData}
      itemCount={filteredNodes.length}
      itemSize={itemHeight}
    >
      {Row}
    </FixedSizeList>
  )
}

export default InfiniteTreeView
