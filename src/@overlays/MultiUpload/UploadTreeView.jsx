import React from 'react'
import UploadTreeItem from './UploadTreeItem'

const renderTree = (files, level) => {
  return files.map(f => (
    <>
      <UploadTreeItem key={`${level}-${f.name}`} file={f} level={level} />
      {f.isAssembly && f.subs && renderTree(f.subs, level + 1)}
    </>
  ))
}

const UploadTreeView = ({ fileTree }) => {
  return <div>{renderTree(fileTree, 0)}</div>
}

export const mockFileTree = [
  {
    name: 'Assembly.asm',
    isAssembly: true,
    valid: true,
    subs: [
      {
        name: 'Part 1.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'Part 2.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'Part 3.stl',
        isAssembly: false,
        valid: true,
      },
      {
        name: 'Sub-Assembly.asm',
        isAssembly: true,
        valid: true,
        subs: [
          {
            name: 'Part 1.stl',
            isAssembly: false,
            valid: true,
          },
          {
            name: 'Part 2.stl',
            isAssembly: false,
            valid: false,
            skipped: true,
          },
          {
            name: 'Part 3.stl',
            isAssembly: false,
            valid: false,
          },
        ],
      },
    ],
  },
]

export default UploadTreeView
