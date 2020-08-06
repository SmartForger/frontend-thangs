import { useState } from 'react'
import * as GraphqlService from '@services/graphql-service'
import { logger } from '../logging'

const graphqlService = GraphqlService.getInstance()

const useDownloadModel = model => {
  const [isDownloading, setIsDownloading] = useState()
  const [hadError, setHadError] = useState()
  const [getDownloadUrl] = graphqlService.useCreateDownloadUrlMutation(model.id)

  const downloadModel = async event => {
    event.preventDefault()
    setIsDownloading(true)
    try {
      const url = await getDownloadUrl()
      window.open(url)
    } catch (error) {
      logger.log('Error getting model download url', error)
      setHadError(true)
    }

    setIsDownloading(false)
  }

  return [isDownloading, hadError, downloadModel]
}

export default useDownloadModel
