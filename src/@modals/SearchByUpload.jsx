import React, { useState, useCallback } from 'react'
import { Uploader, CardCollection, UploadProgress } from '@components'
import * as GraphqlService from '@services/graphql-service'
import { authenticationService } from '@services'
import ModelCards from '@components/CardCollection/ModelCards'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    SearchByUpload: {},
    SearchByUpload_Row: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: '2.5rem',
    },
  }
})

const PROCESSING = 'PROCESSING'
const ERROR = 'ERROR'

const graphqlService = GraphqlService.getInstance()

const Results = ({ modelId }) => {
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

const SearchByUpload = () => {
  const [currentModel, setCurrentModel] = useState()
  const c = useStyles()
  const currentUser = authenticationService.getCurrentUser()
  const [
    uploadModel,
    { loading: isUploading, error: uploadError },
  ] = graphqlService.useUploadModelMutation(currentUser ? currentUser.id : undefined)

  const handleFile = useCallback(
    async file => {
      const model = await uploadModel(file, {
        variables: {
          name: file.name,
          size: file.size,
          userEmail: currentUser.email,
          searchUpload: true,
        },
      })
      setCurrentModel(model)
    },
    [currentUser, uploadModel]
  )

  return (
    <div>
      <div className={c.SearchByUpload_Row}>
        {isUploading ? (
          <UploadProgress />
        ) : currentModel ? (
          <Results modelId={currentModel.id} />
        ) : (
          <>
            <form>
              <Uploader showError={!!uploadError} setFile={handleFile} />
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchByUpload
