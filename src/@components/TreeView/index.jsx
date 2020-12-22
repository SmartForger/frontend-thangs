import React from 'react'
import TreeNode from './TreeNode'

const TreeView = ({ nodes, renderNode, className, levelPadding = 40 }) => {
  return (
    <div className={className}>
      {nodes.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          renderNode={renderNode}
          levelPadding={levelPadding}
        />
      ))}
    </div>
  )
}

export default TreeView
