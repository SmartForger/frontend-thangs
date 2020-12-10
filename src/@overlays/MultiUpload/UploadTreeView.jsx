import React from 'react'
import UploadTreeItem from './UploadTreeItem'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => ({
  UploadTreeView: {
    flex: 1,
    overflowY: 'auto',
  },
}))

const renderTree = (files, level, onSkip, onRemove) => {
  return files.map((f, i) => {
    const handleSkip = path => {
      onSkip([f.name, ...path])
    }

    return (
      <>
        <UploadTreeItem
          key={`${level}-${f.name}`}
          file={f}
          level={level}
          onSkip={onSkip}
          onRemove={onRemove}
        />
        {f.isAssembly && f.subs && renderTree(f.subs, level + 1, handleSkip, onRemove)}
      </>
    )
  })
}

const UploadTreeView = ({ fileTree, onSkip, onRemove }) => {
  const c = useStyles()

  return <div className={c.UploadTreeView}>{renderTree(fileTree, 0, onSkip, onRemove)}</div>
}

export default UploadTreeView
