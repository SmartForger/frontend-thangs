import { useState } from 'react'
import { authenticationService } from '../@services'
import * as GraphqlService from '../@services/graphql-service'
import { uploadToSignedUrl } from '../@services/storageService'

const graphqlService = GraphqlService.getInstance()

const useFolders = () => {
  const useCreateFolder = () => {
    const userId = authenticationService.getCurrentUserId()
    const [createFolder, { loading, error }] = graphqlService.useCreateFolderMutation(
      userId
    )

    return [createFolder, { loading, error }]
  }

  const useAddGroupToFolder = () => {
    const userId = authenticationService.getCurrentUserId()
    const [addGroupToFolder, { loading, error }] = graphqlService.useCreateFolderMutation(
      userId
    )

    return [addGroupToFolder, { loading, error }]
  }

  const useInviteToFolder = folderId => {
    const [inviteToFolder, { loading, error }] = graphqlService.useInviteToFolderMutation(
      folderId
    )

    return [inviteToFolder, { loading, error }]
  }

  const useRevokeAccess = (folderId, userId) => {
    const [revokeAccess, { loading, error }] = graphqlService.useRevokeAccessMutation(
      folderId,
      userId
    )
    return [revokeAccess, { loading, error }]
  }

  const useFolder = folderId => {
    const { loading, error, folder } = graphqlService.useFolderById(folderId)
    return { loading, error, folder }
  }

  const useAddToFolder = folderId => {
    const [loading, setLoading] = useState()
    const [
      createUploadUrl,
      { error: errorCreateUploadUrl },
    ] = graphqlService.useCreateUploadUrl()

    const [
      addToFolder,
      { error: errorAddToFolder, folder },
    ] = graphqlService.useAddToFolderMutation(folderId)

    const upload = async (file, { variables }) => {
      setLoading(true)
      const urlResult = await createUploadUrl({
        variables: { filename: file.name },
      })

      try {
        const {
          data: {
            createUploadUrl: { originalFilename, newFilename, uploadUrl },
          },
        } = urlResult

        await uploadToSignedUrl(uploadUrl, file)
        await addToFolder({
          variables: {
            ...variables,
            filename: newFilename,
            originalFilename,
          },
        })
      } finally {
        setLoading(false)
      }
    }

    return [
      upload,
      {
        loading,
        error: errorCreateUploadUrl || errorAddToFolder,
        folder,
      },
    ]
  }

  const useDeleteFolder = folderId => {
    const currentUserId = authenticationService.getCurrentUserId()
    return graphqlService.useDeleteFolderMutation(folderId, currentUserId)
  }

  return {
    useCreateFolder,
    useAddGroupToFolder,
    useInviteToFolder,
    useRevokeAccess,
    useFolder,
    useAddToFolder,
    useDeleteFolder,
  }
}

export default useFolders
