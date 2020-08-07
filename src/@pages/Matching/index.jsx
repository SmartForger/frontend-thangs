import React, { useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import {
  Button,
  NewThemeLayout,
  Uploader,
  CardCollection,
  UploadProgress,
} from '@components'
import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    Matching: {
      display: 'flex',
      flexDirection: 'column',
    },
    Matching_Header: {
      ...theme.mixins.text.subheaderText,
      marginBottom: '1rem',
    },
    Matching_Subheader: {
      ...theme.mixins.text.matchingSubheader,
      marginBottom: '1.5rem',
    },
    Matching_Button: {
      backgroundColor: theme.variables.colors.deleteButton,
      marginTop: '1.5rem',
      alignSelf: 'flex-end',
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
    <CardCollection noResultsText='No geometric similar matches found. Try uploading another model.'>
      <ModelCards models={model.relatedModels} />
    </CardCollection>
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
  ] = graphqlService.useUploadModelMutation(currentUser ? currentUser.id : undefined)

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

  const onCancel = useCallback(() => history.push('/'), [history])

  return (
    <div className={c.Matching}>
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
          <Button
            className={c.Matching_Button}
            onClick={() => {
              onCancel()
            }}
          >
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
