import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Uploader, UploadProgress } from '@components'
import * as GraphqlService from '@services/graphql-service'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    SearchByUpload: {},
    SearchByUpload_Row: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }
})

const graphqlService = GraphqlService.getInstance()

const sanitizeFileName = name => name.replace(/ /g, '_')

const PollingComponent = ({ modelId, dispatch }) => {
  const {
    loading,
    error,
    model,
    startPolling,
    stopPolling,
  } = graphqlService.useUploadedModelByIdWithRelated(modelId)
  if (!loading && !error && model) {
    stopPolling()
    debugger
    dispatch('update-search-results', model)
  }
  startPolling(1000)
}

const SearchByUpload = () => {
  const [model, setModel] = useState(null)
  const c = useStyles()
  const history = useHistory()
  const { dispatch, searchResults } = useStoreon('searchResults')

  // if (error || !model || model.uploadStatus === ERROR) {
  //   return <div>There was an error analyzing your model. Please try again later.</div>
  // }
  const handleFile = useCallback(
    async file => {
      const requiredVariables = {
        name: sanitizeFileName(file.name),
        size: file.size,
      }

      dispatch('get-search-results-by-model', {
        file,
        data: {
          ...requiredVariables,
        },
        onUploaded: model => {
          setModel(model)
        },
        onFinish: _results => {
          history.push(`/search/${file.name}`)
          dispatch('hide-modal')
        },
        onError: error => {
          // eslint-disable-next-line no-console
          console.log('e:', error)
        },
      })
    },
    [dispatch, history]
  )
  console.log(model)
  return (
    <div>
      <div className={c.SearchByUpload_Row}>
        {searchResults.isLoading ? (
          <UploadProgress />
        ) : (
          <>
            <form>
              <Uploader showError={!!searchResults.isError} setFile={handleFile} />
            </form>
            {model && <PollingComponent dispatch={dispatch} modelId={model.id} />}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchByUpload
