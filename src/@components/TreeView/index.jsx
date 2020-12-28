import React from 'react'
import cn from 'classnames'
import { createUseStyles } from '@style'
import TreeNode from './TreeNode'
import Spinner from '../Spinner'

const useStyles = createUseStyles(theme => {
  return {
    TreeView_Root: {
      position: 'relative',
    },
    TreeView_Content: {
      height: '100%',
      overflowY: 'auto',

      '&::-webkit-scrollbar': {
        width: '.75rem',
      },
      '&::-webkit-scrollbar-track': {
        background: theme.colors.white[600],
        borderRadius: '.5rem',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#C7C7C7',
        borderRadius: 20,
        border: `3px solid ${theme.colors.white[600]}`,
      },
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

const TreeView = ({ nodes, renderNode, className, levelPadding = 40, loading }) => {
  const c = useStyles()

  return (
    <div className={cn(c.TreeView_Root, className)}>
      <div className={c.TreeView_Content}>
        {nodes.map(node => (
          <TreeNode
            key={node.id}
            node={node}
            renderNode={renderNode}
            level={0}
            levelPadding={levelPadding}
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
