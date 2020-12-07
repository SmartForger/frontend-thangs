import React from 'react'
import UploadTreeItem from './UploadTreeItem'

const renderTree = (files, level, onSkip, onRemove) => {
  return files.map((f, i)=> {
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
        {f.isAssembly &&
          f.subs &&
          renderTree(f.subs, level + 1, handleSkip, onRemove)}
      </>
    )
  })
}

const UploadTreeView = ({ fileTree, onSkip, onRemove }) => {
  return <div>{renderTree(fileTree, 0, onSkip, onRemove)}</div>
}

export default UploadTreeView
