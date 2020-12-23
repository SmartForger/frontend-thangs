import React, { useState } from 'react'
import { Spacer } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'

export const TreeNode = ({ node, renderNode, level, levelPadding }) => {
  const [expanded, setExpanded] = useState(false)
  const c = useStyles()

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={c.TreeNode_Root}>
      <div className={c.TreeNode_Row}>
        <div className={c.TreeNode_ExpandIcon} onClick={toggleExpanded}>
          {node.subs &&
            node.subs.length > 0 &&
            (expanded ? <ArrowDown /> : <ArrowRight />)}
        </div>
        <Spacer size={12} />
        {renderNode(node, level)}
      </div>
      {expanded && node.subs && node.subs.length > 0 && (
        <div className={c.TreeNode_Row}>
          <Spacer size={levelPadding} />
          <div className={c.TreeNode_Children}>
            {node.subs.map(subnode => (
              <TreeNode
                key={subnode.id}
                node={subnode}
                renderNode={renderNode}
                level={level + 1}
                levelPadding={levelPadding}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const useStyles = createUseStyles(theme => {
  return {
    TreeNode_Root: {
      flex: 1,
    },
    TreeNode_Children: {
      flex: 1,
    },
    TreeNode_Row: {
      display: 'flex',
      alignItems: 'center',
    },
    TreeNode_ExpandIcon: {
      width: '0.75rem',
      cursor: 'pointer',
    },
  }
})

export default TreeNode
