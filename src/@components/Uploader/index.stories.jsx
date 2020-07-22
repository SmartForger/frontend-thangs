import React, { useState } from 'react'
import { withApolloProvider } from '../../../.storybook/withApolloProvider'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Button: {
      marginTop: '2rem',
    },
  }
})
import { Uploader } from './'

export function UploaderStory() {
  const c = useStyles()
  const [file, setFile] = useState()
  const [uploadError, setUploadError] = useState()

  return (
    <div>
      <Uploader showError={!!uploadError} file={file} setFile={setFile} />
      <button
        className={c.Button}
        onClick={() => setUploadError({ message: 'upload error' })}
      >
        Simulate Upload Error
      </button>
    </div>
  )
}

export default {
  title: 'Uploader',
  component: Uploader,
  decorators: [withApolloProvider()],
}
