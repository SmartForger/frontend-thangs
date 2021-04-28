import React from 'react'
import cn from 'classnames'
import { createUseStyles } from '@physna/voxel-ui/@style'
import TreeNode from './TreeNode'
import Spinner from '../Spinner'

const useStyles = createUseStyles(theme => {
  return {
    TreeView_Root: {
      position: 'relative',
    },
    TreeView_Content: {
      ...theme.mixins.scrollbar,
      height: '100%',
      overflowY: 'auto',
    },
    TreeView_Loading: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      left: 0,
      top: 0,
      overflow: 'hidden',
      backgroundColor: theme.colors.white[500] + '80',
    },
  }
})

const TreeView = ({
  nodes,
  renderNode,
  className,
  levelPadding = 40,
  loading,
  defaultExpanded,
  rootCollapsible,
  isSelected = () => false,
  classes = {
    item: '',
    itemSelected: '',
    container: '',
  },
  showDivider = true,
  rowSpacing,
  subnodeField = 'subs',
  showExpandIcon = true,
}) => {
  const c = useStyles()

  return (
    <div className={cn(c.TreeView_Root, className)}>
      <div className={cn(c.TreeView_Content, classes.container)}>
        {nodes.map((node, index) => (
          <TreeNode
            key={`treeNode_${node.id}`}
            node={node}
            renderNode={renderNode}
            isLastNode={index === nodes.length - 1}
            level={0}
            levelPadding={levelPadding}
            defaultExpanded={defaultExpanded}
            rootCollapsible={rootCollapsible}
            isSelected={isSelected}
            classes={classes}
            showDivider={showDivider}
            rowSpacing={rowSpacing}
            subnodeField={subnodeField}
            showExpandIcon={showExpandIcon}
          />
        ))}
      </div>
      {loading && (
        <div className={cn(c.TreeView_Loading, 'loading')}>
          <div>
            <Spinner size='2rem' />
          </div>
        </div>
      )}
    </div>
  )
}

export default TreeView
