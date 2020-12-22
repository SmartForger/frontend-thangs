import React, { useState } from 'react'
import { Spacer } from '@components'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'
import { ReactComponent as ArrowDown } from '@svg/icon-arrow-down-sm.svg'

export const TreeNode = ({ node, renderNode, levelPadding }) => {
  const [expanded, setExpanded] = useState(false)
  const c = useStyles()

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div>
      <div className={c.Row}>
        <div className={c.TreeNode_ExpandIcon} onClick={toggleExpanded}>
          {node.subs &&
            node.subs.length > 0 &&
            (expanded ? <ArrowDown /> : <ArrowRight />)}
        </div>
        <Spacer size={12} />
        {renderNode(node)}
      </div>
      {expanded && node.subs && node.subs.length > 0 && (
        <div className={c.Row}>
          <Spacer size={levelPadding} />
          <div>
            {node.subs.map(subnode => (
              <TreeNode key={subnode.id} node={subnode} renderNode={renderNode} levelPadding={levelPadding} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const useStyles = createUseStyles(theme => {
  return {
    Row: {
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
