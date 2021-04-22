import React from 'react'
import ModelHistory from '@components/ModelHistory'
import { ContainerColumn } from '@components'

const FileHistory = ({ setActiveViewer }) => {
  return (
    <ContainerColumn fullWidth>
      <ModelHistory setActiveViewer={setActiveViewer} />
    </ContainerColumn>
  )
}

export default FileHistory
