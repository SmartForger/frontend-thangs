import React, { useState } from 'react'
import Divider from '@components/Divider'
import Spacer from '@components/Spacer'
import classnames from 'classnames'
import { createUseStyles } from '@physna/voxel-ui'
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
    TreeNode_Row: {
      display: 'flex',
      alignItems: 'center',
    },
    TreeNode_Spacer: {
      flex: 'none',
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
  isSelected,
  classes,
  showDivider,
  rowSpacing,
  subnodeField,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded || !rootCollapsible)
  const c = useStyles()

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const subnodes = node[subnodeField] || []
  const isAssembly = subnodes.length > 0
  const isAssemblyPart = level > 0 && subnodes.length === 0
  return (
    <>
      <div className={c.TreeNode_Root}>
        <div
          className={classnames(c.TreeNode_Row, classes.item, {
            [classes.itemSelected]: isSelected(node),
          })}
        >
          <Spacer className={c.TreeNode_Spacer} width={levelPadding * level + 'px'} />
          {(isAssembly || isAssemblyPart) && rootCollapsible && (
            <>
              <div className={c.TreeNode_Row}>
                <div
                  className={classnames(c.TreeNode_ExpandIcon, {
                    [c.TreeNode_ExpandIcon__expanded]: expanded,
                  })}
                  onClick={toggleExpanded}
                  data-jest='toggle'
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
        {expanded && subnodes.length > 0 && (
          <>
            {showDivider && <Divider spacing={0} />}
            {rowSpacing && <Spacer size={rowSpacing} />}
            {subnodes.map((subnode, index) => (
              <TreeNode
                isLastNode={index === subnodes.length - 1}
                key={`subnode_${subnode.id}`}
                level={level + 1}
                levelPadding={levelPadding}
                node={subnode}
                renderNode={renderNode}
                isSelected={isSelected}
                classes={classes}
                showDivider={showDivider}
                rowSpacing={rowSpacing}
                subnodeField={subnodeField}
              />
            ))}
          </>
        )}
      </div>
      {!isLastNode && showDivider && <Divider spacing={0} />}
      {rowSpacing && <Spacer size={rowSpacing} />}
    </>
  )
}

export default TreeNode
