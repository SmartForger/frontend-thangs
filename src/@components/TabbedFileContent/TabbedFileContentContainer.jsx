import React, { useState } from 'react'
import { useStoreon } from 'storeon/react'
import TabbedFileContent from './TabbedFileContent'
import FileDiscussion from './FileDiscussion'
import FileHistory from './FileHistory'
import FileParts from './FileParts'

const tabKeys = {
  files: 'files',
  discussion: 'discussion',
  history: 'history',
}

const tabs = [
  {
    key: tabKeys.files,
    label: 'Files',
    Component: FileParts,
  },
  {
    key: tabKeys.discussion,
    label: 'Discussion',
    Component: FileDiscussion,
  },
  {
    key: tabKeys.history,
    label: 'Version History',
    Component: FileHistory,
  },
]

const TabbedFileContentContainer = props => {
  const { dispatch } = useStoreon()
  const [selected, setSelected] = useState(tabKeys.files)

  return (
    <TabbedFileContent
      {...props}
      dispatch={dispatch}
      tabs={tabs}
      selected={selected}
      setSelected={setSelected}
    />
  )
}

export default TabbedFileContentContainer
