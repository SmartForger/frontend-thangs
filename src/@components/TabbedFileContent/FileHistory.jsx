import React from 'react'
import { FileTable } from '@components'

const noop = () => null
const FileHistory = props => {
  const { model, onRowSelect = noop } = props

  return <div>File History</div>
}

export default FileHistory
