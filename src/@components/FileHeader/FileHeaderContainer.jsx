import React from 'react'
import { useStoreon } from 'storeon/react'
import FileHeader from './FileHeader'

const FileHeaderContainer = props => {
  const { dispatch } = useStoreon()

  return <FileHeader {...props} dispatch={dispatch} />
}

FileHeaderContainer.displayName = 'FileHeaderContainer'

export default FileHeaderContainer
