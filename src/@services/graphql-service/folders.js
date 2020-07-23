import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { USER_QUERY, parseUser } from './users'
import { parseModel } from './models'

export const FOLDER_QUERY = gql`
    query folderQuery($id: ID) {
        folder(id: $id) {
            id
            size
            name
            creator {
                id
            }
            models {
                id
                name
                owner {
                    id
                    fullName
                    profile {
                        avatarUrl
                    }
                }
                likesCount
                commentsCount
                uploadedFile
                uploadStatus
            }
            members {
                id
                fullName
                email
                profile {
                    avatarUrl
                }
            }
        }
    }
`

export function parseFolder(folder) {
  if (!folder) {
    return undefined
  }

  const models = folder.models ? folder.models.map(parseModel) : []
  const members = folder.members ? folder.members.map(parseUser) : []

  return {
    ...folder,
    models,
    members,
  }
}

export const useFolderById = id => {
  const { loading, error, data } = useQuery(FOLDER_QUERY, {
    variables: { id },
  })
  const folder = data && parseFolder(data.folder)
  return { loading, error, folder }
}

export const CREATE_FOLDER_MUTATION = gql`
    mutation createFolder($name: String!, $members: [String]) {
        createFolder(name: $name, members: $members) {
            folder {
                id
                name
            }
        }
    }
`

export const useCreateFolderMutation = id => {
  return useMutation(CREATE_FOLDER_MUTATION, {
    refetchQueries: [
      {
        query: USER_QUERY,
        variables: { id },
      },
    ],
  })
}

export const INVITE_TO_FOLDER_MUTATION = gql`
    mutation inviteToFolder($folderId: ID, $emails: [String]) {
        inviteToFolder(folderId: $folderId, emails: $emails) {
            folder {
                id
                members {
                    id
                }
            }
        }
    }
`

export const useInviteToFolderMutation = folderId => {
  return useMutation(INVITE_TO_FOLDER_MUTATION, {
    variables: { folderId },
    refetchQueries: [
      {
        query: FOLDER_QUERY,
        variables: { id: folderId },
      },
    ],
  })
}

export const REVOKE_ACCESS_MUTATION = gql`
    mutation revokeAccess($folderId: ID, $userId: ID) {
        revokeAccess(folderId: $folderId, userId: $userId) {
            folder {
                id
                members {
                    id
                }
            }
        }
    }
`

export const useRevokeAccessMutation = (folderId, userId) => {
  return useMutation(REVOKE_ACCESS_MUTATION, {
    variables: { folderId, userId },
    refetchQueries: [
      {
        query: FOLDER_QUERY,
        variables: { id: folderId },
      },
    ],
  })
}

const ADD_TO_FOLDER_MUTATION = gql`
    mutation addToFolder(
        $folderId: ID
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
        addToFolder(
            folderId: $folderId
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
            }
            folder {
                id
                size
                name
                models {
                    id
                }
                members {
                    id
                }
            }
        }
    }
`

export function useAddToFolderMutation(folderId) {
  const [addToFolder, { loading, error, data }] = useMutation(
    ADD_TO_FOLDER_MUTATION,
    {
      variables: {
        folderId,
      },
      refetchQueries: [
        { query: FOLDER_QUERY, variables: { id: folderId } },
      ],
    }
  )

  const folder =
        data &&
        data.addToFolder &&
        data.addToFolder.folder &&
        parseFolder(data.addToFolder.folder)

  return [addToFolder, { loading, error, folder }]
}

const DELETE_FOLDER_MUTATION = gql`
    mutation deleteFolder($folderId: ID!) {
        deleteFolder(folderId: $folderId) {
            ok
        }
    }
`

export function useDeleteFolderMutation(folderId, userId) {
  return useMutation(DELETE_FOLDER_MUTATION, {
    variables: { folderId },

    refetchQueries: [
      {
        query: USER_QUERY,
        variables: { id: userId },
      },
    ],
  })
}
