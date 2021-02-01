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
  const {
    items,
    hasMultiRoots,
    isSelected,
    levelPadding,
    classes,
    renderNode,
    toggleNode,
  } = data
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
      {(node.level > 0 || hasMultiRoots) && (
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

const InfiniteTreeView = ({
  classes,
  nodes,
  renderNode,
  itemHeight,
  width,
  height,
  levelPadding = 40,
  isSelected = () => false,
}) => {
  const [expandedNodes, setExpandedNodes] = useState([])
  const c = useStyles()

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

    nodes.forEach((node, i) => {
      if (node.level <= lastLevel) {
        const { parts, ...newNode } = node
        newNode.isLeaf = !nodes[i + 1] || nodes[i + 1].level <= node.level
        if ((node.level > 0 || hasMultiRoots) && !expandedNodes.includes(node.id)) {
          lastLevel = node.level
          newNode.closed = true
        } else {
          lastLevel = nodes.length
        }
        newNodes.push(newNode)
      }
    })

    return newNodes
  }, [nodes, expandedNodes])

  const itemData = useMemo(() => {
    const hasMultiRoots = filteredNodes.filter(node => node.level === 0).length > 1

    return {
      items: filteredNodes,
      hasMultiRoots,
      toggleNode,
      renderNode,
      classes: { ...c, ...classes },
      levelPadding,
      isSelected,
    }
  }, [filteredNodes, toggleNode, renderNode, levelPadding, isSelected, classes])

  return (
    <FixedSizeList
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
