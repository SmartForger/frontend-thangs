import React, { useState } from 'react'
import { Spacer } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'

const useStyles = createUseStyles(_theme => {
  return {
    '@keyframes spin': {
      '0%': {
        transform: 'rotate(0deg)',
      },
      '100%': {
        transform: 'rotate(360deg)',
      },
    },
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

export const TreeNode = ({ node, renderNode, level, levelPadding }) => {
  const [expanded, setExpanded] = useState(false)
  const c = useStyles()

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  return (
    <div className={c.TreeNode_Root}>
      <div className={c.TreeNode_Row}>
        <div
          className={classnames(c.TreeNode_ExpandIcon, {
            [c.TreeNode_ExpandIcon__expanded]: expanded,
          })}
          onClick={toggleExpanded}
        >
          {node.subs && node.subs.length > 0 && <ArrowRight />}
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

export default TreeNode
