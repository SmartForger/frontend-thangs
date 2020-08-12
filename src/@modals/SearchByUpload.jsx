import React, { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Uploader, CardCollection, UploadProgress } from '@components'
import * as GraphqlService from '@services/graphql-service'
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

const sanitizeFileName = name => name.replace(/ /g, '_')

const SearchByUpload = ({ handleModalClose }) => {
  const c = useStyles()
  const history = useHistory()
  const { dispatch, searchResults } = useStoreon('searchResults')
  // const {
  //   loading,
  //   error,
  //   model,
  //   startPolling,
  //   stopPolling,
  // } = graphqlService.useUploadedModelByIdWithRelated(modelId)

  // if (loading || (model && model.uploadStatus === PROCESSING)) {
  //   startPolling(1000)
  //   return <UploadProgress />
  // }

  // stopPolling()

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
        onFinish: _results => {
          history.push(`/search/${file.name}`)
          handleModalClose()
        },
        onError: error => {
          // eslint-disable-next-line no-console
          console.log('e:', error)
        },
      })
    },
    [dispatch, handleModalClose, history]
  )

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
          </>
        )}
      </div>
    </div>
  )
}

export default SearchByUpload
