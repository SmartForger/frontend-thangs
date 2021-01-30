import React, { useState, useMemo, useCallback, memo } from 'react'
import { FixedSizeList, areEqual } from 'react-window'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ReactComponent as IndentArrow } from '@svg/icon-indent-arrow.svg'
import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'

const useStyles = createUseStyles(theme => {
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
  const { items, classes, renderNode, toggleNode } = data
  const node = items[index]

  return (
    <div
      className={classes.TreeNode}
      style={{
        ...style,
        paddingLeft: 40 * node.level,
      }}
    >
      <div
        className={classnames(classes.TreeNode_ExpandIcon, {
          [classes.TreeNode_ExpandIcon__expanded]: !node.isLeaf && !node.closed,
        })}
        onClick={() => toggleNode(node)}
      >
        {node.isLeaf ? <IndentArrow /> : <ArrowRight />}
      </div>
      {renderNode(node)}
    </div>
  )
}, areEqual)

const InfiniteTreeView = ({
  className,
  nodes,
  renderNode,
  itemHeight,
  width,
  height,
}) => {
  const [foldedNodes, setFoldedNodes] = useState([])
  const c = useStyles()

  const toggleNode = useCallback(node => {
    setFoldedNodes(folded => {
      const index = folded.indexOf(node.id)
      if (index >= 0) {
        folded.splice(index, 1)
      } else {
        folded.push(node.id)
      }
      return folded.slice()
    })
  }, [])

  const filteredNodes = useMemo(() => {
    const newNodes = []
    let lastLevel = nodes.length
    nodes.forEach((node, i) => {
      if (node.level <= lastLevel) {
        const { parts, ...newNode } = node
        newNode.isLeaf = !nodes[i + 1] || nodes[i + 1].level <= node.level
        if (foldedNodes.includes(node.id)) {
          lastLevel = node.level
          newNode.closed = true
        } else {
          lastLevel = nodes.length
        }
        newNodes.push(newNode)
      }
    })

    return newNodes
  }, [nodes, foldedNodes])

  const itemData = useMemo(
    () => ({
      items: filteredNodes,
      toggleNode,
      renderNode,
      classes: c,
    }),
    [filteredNodes, toggleNode, renderNode]
  )

  return (
    <FixedSizeList
      className={className}
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
