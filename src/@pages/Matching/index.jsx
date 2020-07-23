import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { NewThemeLayout } from '@components/Layout'
import { Button } from '@components/Button'
import { Uploader } from '@components/Uploader'
import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'
import CardCollection from '@components/CardCollection'
import { UploadProgress } from '@components/UploadProgress'

import { subheaderText, matchingSubheader } from '@style/text'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Matching: {},
    Matching_Header: {
      ...subheaderText,
      marginBottom: '1rem',
    },
    Matching_Subheader: {
      ...matchingSubheader,
      marginBottom: '1.5rem',
    },
    Matching_Button: {
      backgroundColor: theme.variables.colors.deleteButton,
      marginTop: '1.5rem',
      float: 'right',
    },
  }
})

const PROCESSING = 'PROCESSING'
const ERROR = 'ERROR'

const graphqlService = GraphqlService.getInstance()

function Results({ modelId }) {
  const {
    loading,
    error,
    model,
    startPolling,
    stopPolling,
  } = graphqlService.useUploadedModelByIdWithRelated(modelId)

  if (loading || (model && model.uploadStatus === PROCESSING)) {
    startPolling(1000)
    return <UploadProgress />
  }

  stopPolling()

  if (error || !model || model.uploadStatus === ERROR) {
    return <div>There was an error analyzing your model. Please try again later.</div>
  }

  return (
    <CardCollection
      models={model.relatedModels}
      noResultsText='No geometric similar matches found. Try uploading another model.'
    />
  )
}

function Page() {
  const [currentModel, setCurrentModel] = useState()
  const history = useHistory()
  const c = useStyles()
  const currentUser = authenticationService.getCurrentUser()
  const [
    uploadModel,
    { loading: isUploading, error: uploadError },
  ] = graphqlService.useUploadModelMutation(currentUser.id)

  async function handleFile(file) {
    const model = await uploadModel(file, {
      variables: {
        name: file.name,
        size: file.size,
        userEmail: currentUser.email,
        searchUpload: true,
      },
    })
    setCurrentModel(model)
  }

  const onCancel = () => history.push('/')

  return (
    <div>
      <h1 className={c.Matching_Header}>Search by Model</h1>
      <h4 className={c.Matching_Subheader}>
        Upload your model to see other models with similar geometry.
      </h4>
      {isUploading ? (
        <UploadProgress />
      ) : currentModel ? (
        <Results modelId={currentModel.id} />
      ) : (
        <>
          <form>
            <Uploader showError={!!uploadError} setFile={handleFile} />
          </form>
          <Button className={c.Matching_Button} onClick={onCancel}>
            Cancel
          </Button>
        </>
      )}
    </div>
  )
}

const Matching = () => {
  return (
    <NewThemeLayout>
      <Page />
    </NewThemeLayout>
  )
}

export { Matching }
