import { useState } from 'react'
import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { storageService } from '@services'
import * as R from 'ramda'
import { logger } from '@utilities/logging'
import { THUMBNAILS_HOST } from '@utilities/constants'

import { USER_QUERY, parseUser } from './users'

const MODEL_FRAGMENT = gql`
  fragment Model on ModelType {
    id
    name
    likes {
      isLiked
      owner {
        id
        firstName
        lastName
        fullName
      }
    }
    owner {
      id
      firstName
      lastName
      fullName
      profile {
        avatarUrl
      }
    }
    attachment {
      id
      attachmentId
    }
    likesCount
    commentsCount
    uploadStatus
    description
    category
    weight
    height
    material
    uploadedFile
  }
`

export const MODEL_WITH_RELATED_QUERY = gql`
  query getModel($id: ID) {
    model(id: $id) {
      ...Model
      relatedModels {
        ...Model
      }
    }
  }

  ${MODEL_FRAGMENT}
`

const UPLOADED_MODEL_WITH_RELATED_QUERY = gql`
  query getModel($id: ID) {
    model(id: $id) {
      id
      uploadStatus
      relatedModels {
        ...Model
      }
    }
  }

  ${MODEL_FRAGMENT}
`

const MODEL_QUERY = gql`
  query getModel($id: ID) {
    model(id: $id) {
      ...Model
    }
  }

  ${MODEL_FRAGMENT}
`

const LIKE_MODEL_MUTATION = gql`
  mutation likeModel($userId: ID, $modelId: ID) {
    likeModel(userId: $userId, modelId: $modelId) {
      user {
        id
        firstName
        lastName
        fullName
        profile {
          description
          avatarUrl
        }
      }
      model {
        ...Model
      }
      like {
        id
      }
    }
  }

  ${MODEL_FRAGMENT}
`

const UNLIKE_MODEL_MUTATION = gql`
  mutation unlikeModel($userId: ID, $modelId: ID) {
    unlikeModel(userId: $userId, modelId: $modelId) {
      user {
        id
        firstName
        lastName
        fullName
        profile {
          description
          avatarUrl
        }
      }
      model {
        ...Model
      }
      like {
        id
      }
    }
  }

  ${MODEL_FRAGMENT}
`

const MODELS_BY_DATE_QUERY = gql`
  query modelsByDate {
    modelsByDate {
      ...Model
    }
  }
  ${MODEL_FRAGMENT}
`

const MODELS_BY_LIKES_QUERY = gql`
  query modelsByLikes {
    modelsByLikes {
      ...Model
    }
  }
  ${MODEL_FRAGMENT}
`

const getModel = R.pathOr(null, ['model'])
const getModelsByDate = R.pathOr(null, ['modelsByDate'])
const getModelsByLikes = R.pathOr(null, ['modelsByLikes'])
const getSearchModels = R.pathOr(null, ['searchModels'])

function parseThumbnailUrl(filename) {
  return `${THUMBNAILS_HOST}/${filename}`
}

export function parseModel(model) {
  const relatedModels = model.relatedModels
    ? model.relatedModels.map(m => {
      return parseRelatedModel(m)
    })
    : null
  const owner = model.owner && parseUser(model.owner)
  const fullThumbnailUrl = parseThumbnailUrl(model.uploadedFile)

  return {
    ...model,
    owner,
    fullThumbnailUrl,
    relatedModels,
  }
}

export function parseRelatedModel(model) {
  const relatedModels = null
  const owner = model.owner && parseUser(model.owner)
  const fullThumbnailUrl = parseThumbnailUrl(model.uploadedFile)

  return {
    ...model,
    owner,
    fullThumbnailUrl,
    relatedModels,
  }
}

const parseModelsByDatePayload = data => {
  const models = getModelsByDate(data)
  if (!models) {
    return null
  }

  return models.map(parseModel)
}

const parseModelsByLikePayload = data => {
  const models = getModelsByLikes(data)
  if (!models) {
    return null
  }

  return models.map(parseModel)
}

const useModelById = id => {
  const { loading, error, data } = useQuery(MODEL_QUERY, {
    variables: { id },
  })
  const model = parseModelPayload(data)

  return { loading, error, model }
}

export function useModelByIdWithRelated(id) {
  const { loading, error, data, startPolling, stopPolling } = useQuery(
    MODEL_WITH_RELATED_QUERY,
    {
      variables: { id },
    }
  )
  const model = parseModelPayload(data)

  return { loading, error, model, startPolling, stopPolling }
}

export function useUploadedModelByIdWithRelated(id) {
  const { loading, error, data, startPolling, stopPolling } = useQuery(
    UPLOADED_MODEL_WITH_RELATED_QUERY,
    {
      variables: { id },
    }
  )
  const model = parseModelPayload(data)

  return { loading, error, model, startPolling, stopPolling }
}

const useLikeModelMutation = (userId, modelId) => {
  return useMutation(LIKE_MODEL_MUTATION, {
    variables: { userId, modelId },
    refetchQueries: [
      {
        query: MODEL_QUERY,
        variables: { id: modelId }
      },
      {
        query: USER_QUERY,
        variables: { id: userId },
      }
    ],
    update: (
      store,
      {
        data: {
          likeModel: { model },
        },
      }
    ) => {
      store.writeQuery({
        query: MODEL_QUERY,
        variables: { id: `${model.id}` },
        data: { model },
      })
    },
  })
}

const useUnlikeModelMutation = (userId, modelId) => {
  return useMutation(UNLIKE_MODEL_MUTATION, {
    variables: { userId, modelId },
    refetchQueries: [
      {
        query: MODEL_QUERY,
        variables: { id: modelId }
      },
      {
        query: USER_QUERY,
        variables: { id: userId },
      }
    ],
    update: (
      store,
      {
        data: {
          unlikeModel: { model },
        },
      }
    ) => {
      store.writeQuery({
        query: MODEL_QUERY,
        variables: { id: `${model.id}` },
        data: { model },
      })
    },
  })
}

const CREATE_UPLOAD_URL_MUTATION = gql`
  mutation createUploadUrl($filename: String!) {
    createUploadUrl(filename: $filename) {
      uploadUrl
      newFilename
      originalFilename
    }
  }
`

const CREATE_DOWNLOAD_URL_MUTATION = gql`
  mutation createDownloadUrl($modelId: ID!) {
    createDownloadUrl(modelId: $modelId) {
      downloadUrl
    }
  }
`

const UPLOAD_MODEL_MUTATION = gql`
  mutation uploadModel(
    $filename: String!
    $originalFilename: String!
    $name: String!
    $size: Int!
    $description: String
    $weight: String
    $height: String
    $material: String
    $category: String
    $searchUpload: Boolean = false
  ) {
    uploadModel(
      filename: $filename
      originalFilename: $originalFilename
      units: "mm"
      name: $name
      size: $size
      description: $description
      category: $category
      weight: $weight
      height: $height
      material: $material
      searchUpload: $searchUpload
    ) {
      model {
        id
        name
        created
        likesCount
        commentsCount
        attachment {
          id
          imgSrc
        }
        uploadStatus
        uploadedFile
      }
    }
  }
`

const parseModelPayload = data => {
  const model = getModel(data)
  if (!model) {
    return null
  }

  return parseModel(model)
}

const useModelsByDate = () => {
  const { error, loading, data } = useQuery(MODELS_BY_DATE_QUERY)

  const models = parseModelsByDatePayload(data)

  return { loading, error, models }
}

const useModelsByLikes = () => {
  const { error, loading, data } = useQuery(MODELS_BY_LIKES_QUERY)

  const models = parseModelsByLikePayload(data)

  return { loading, error, models }
}

const SEARCH_MODELS_QUERY = gql`
  query searchModels($query: String!) {
    searchModels(query: $query) {
      ...Model
    }
  }
  ${MODEL_FRAGMENT}
`

const useCreateDownloadUrlMutation = modelId => {
  const [createDownloadUrl] = useMutation(CREATE_DOWNLOAD_URL_MUTATION, {
    variables: { modelId: modelId },
  })

  async function fetchDownloadUrl() {
    const {
      data: {
        createDownloadUrl: { downloadUrl },
      },
    } = await createDownloadUrl()
    return downloadUrl
  }
  return [fetchDownloadUrl]
}

export function useCreateUploadUrl() {
  return useMutation(CREATE_UPLOAD_URL_MUTATION)
}

const useUploadModelMutation = userId => {
  const [uploadError, setUploadError] = useState()
  const [loading, setLoading] = useState(false)
  const [createUploadUrl] = useCreateUploadUrl()

  const [uploadModel] = useMutation(UPLOAD_MODEL_MUTATION, {
    refetchQueries: [{ query: USER_QUERY, variables: { id: userId } }],
    update(cache, { data: mutationData }) {
      const cachedData = cache.readQuery({
        query: USER_QUERY,
        variables: { id: userId },
      })
      cachedData.user.models.push(mutationData.uploadModel.model)
      cache.writeQuery({ query: USER_QUERY, data: cachedData })
    },
  })

  async function uploadModelAndParseResults(file, { variables }) {
    setLoading(true)
    setUploadError()
    try {
      const {
        data: {
          createUploadUrl: { originalFilename, newFilename, uploadUrl },
        },
      } = await createUploadUrl({
        variables: {
          filename: file.name,
        },
      })

      await storageService.uploadToSignedUrl(uploadUrl, file)

      const response = await uploadModel({
        variables: {
          ...variables,
          filename: newFilename,
          originalFilename,
        },
      })
      return (
        response.data &&
        response.data.uploadModel &&
        parseModel(response.data.uploadModel.model)
      )
    } catch (e) {
      setUploadError(e)
      logger.error('Upload failed with error:', e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return [uploadModelAndParseResults, { loading, error: uploadError }]
}

const parseSeachModelsPayload = data => {
  const models = getSearchModels(data)

  if (!models) {
    return null
  }

  return models.map(parseModel)
}

const useSearchModels = searchQuery => {
  const { error, loading, data } = useQuery(SEARCH_MODELS_QUERY, {
    variables: { query: searchQuery },
  })

  const models = parseSeachModelsPayload(data)

  return { loading, error, models }
}

const DELETE_MODEL_MUTATION = gql`
  mutation deleteModel($modelId: ID!) {
    deleteModel(modelId: $modelId) {
      ok
    }
  }
`

const useDeleteModelMutation = (modelId, userId) => {
  const [deleteModel, { loading, data, error }] = useMutation(DELETE_MODEL_MUTATION, {
    variables: {
      modelId,
    },
    refetchQueries: [{ query: USER_QUERY, variables: { id: userId } }],
  })

  const ok = data && data.deleteModel && data.deleteModel.ok
  return [deleteModel, { loading, ok, error }]
}

export {
  useModelById,
  useLikeModelMutation,
  useUnlikeModelMutation,
  useUploadModelMutation,
  useCreateDownloadUrlMutation,
  useModelsByDate,
  useModelsByLikes,
  useSearchModels,
  useDeleteModelMutation,
}
