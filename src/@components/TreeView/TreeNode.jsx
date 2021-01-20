import React, { useState } from 'react'
import { Divider, Spacer } from '@components'
import classnames from 'classnames'
import { createUseStyles } from '@style'
import { ReactComponent as ArrowRight } from '@svg/icon-arrow-right-sm.svg'
import { ReactComponent as IndentArrow } from '@svg/icon-indent-arrow.svg'

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

export const TreeNode = ({
  defaultExpanded = false,
  rootCollapsible = true,
  isLastNode = false,
  level,
  levelPadding,
  node,
  renderNode,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded || !rootCollapsible)
  const c = useStyles()

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const isAssembly = node.subs && node.subs.length > 0
  const isAssemblyPart = level > 0 && (!node.subs || !node.subs.length)
  return (
    <>
      <div className={c.TreeNode_Root}>
        <div className={c.TreeNode_Row}>
          {(isAssembly || isAssemblyPart) && rootCollapsible && (
            <>
              <div className={c.TreeNode_Row}>
                <div
                  className={classnames(c.TreeNode_ExpandIcon, {
                    [c.TreeNode_ExpandIcon__expanded]: expanded,
                  })}
                  onClick={toggleExpanded}
                >
                  {isAssembly && <ArrowRight />}
                  {isAssemblyPart && <IndentArrow />}
                </div>
                <Spacer size={12} />
              </div>
            </>
          )}
          {renderNode(node, level)}
        </div>
        {expanded && node.subs && node.subs.length > 0 && (
          <>
            <Divider spacing={0} />
            <div className={c.TreeNode_Row}>
              <Spacer size={levelPadding} />
              <div className={c.TreeNode_Children}>
                {node.subs.map((subnode, index) => (
                  <TreeNode
                    isLastNode={index === node.subs.length - 1}
                    key={`subnode_${subnode.id}`}
                    level={level + 1}
                    levelPadding={levelPadding}
                    node={subnode}
                    renderNode={renderNode}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
      {!isLastNode && <Divider spacing={0} />}
    </>
  )
}

export default TreeNode
