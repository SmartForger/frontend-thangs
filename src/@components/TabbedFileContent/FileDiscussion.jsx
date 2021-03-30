import React from 'react'
import { FileTable } from '@components'

const noop = () => null
const FileDiscussion = props => {
  const { model, onRowSelect = noop } = props

  return (
    <FileTable
      files={[model]}
      handleChangeFolder={onRowSelect}
      sortedBy='created'
    ></FileTable>
  )
}

export default FileDiscussion
