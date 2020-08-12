import React, { useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import { Uploader, UploadProgress } from '@components'
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

const sanitizeFileName = name => name.replace(/ /g, '_')

const SearchByUpload = () => {
  const c = useStyles()
  const history = useHistory()
  const { dispatch, searchResults } = useStoreon('searchResults')

  useEffect(() => {
    dispatch('reset-search-results')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleFile = useCallback(
    file => {
      const requiredVariables = {
        name: sanitizeFileName(file.name),
        size: file.size,
      }

      dispatch('get-search-results-by-model', {
        file,
        data: {
          ...requiredVariables,
        },
        onFinish: ({ modelId }) => {
          dispatch('close-modal')
          history.push(`/search/${file ? file.name : ''}?modelId=${modelId}`)
        },
        onError: error => {
          // eslint-disable-next-line no-console
          console.log('e:', error)
        },
      })
    },
    [dispatch, history]
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
