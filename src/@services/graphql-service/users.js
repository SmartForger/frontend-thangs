import { gql } from 'apollo-boost'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { createAppUrl } from './utils'
import { parseModel } from './models'

export const USER_QUERY = gql`
  query getUser($id: ID) {
    user(id: $id) {
      id
      username
      email
      firstName
      lastName
      fullName
      profile {
        description
        avatarUrl
      }
      models {
        id
        name
        created
        likesCount
        commentsCount
        uploadStatus
        uploadedFile
      }
      folders {
        id
        name
        models {
          id
          name
          uploadedFile
        }
        size
        members {
          id
          username
        }
      }
      inviteCode
      likedModels {
        id
        name
        likesCount
        commentsCount
        uploadStatus
        owner {
          id
          fullName
        }
        attachment {
          id
          imgSrc
        }
        uploadedFile
      }
      isBeingFollowedByRequester
    }
  }
`

const UPDATE_USER_MUTATION = gql`
  mutation updateUser($updateInput: UpdateUserInput!) {
    updateUser(input: $updateInput) {
      user {
        id
        firstName
        lastName
        fullName
        profile {
          description
        }
      }
    }
  }
`

const UPLOAD_USER_PROFILE_AVATAR_MUTATION = gql`
  mutation uploadUserProfileAvatar($userId: ID, $file: Upload!) {
    uploadUserProfileAvatar(userId: $userId, file: $file) {
      user {
        id
        profile {
          avatarUrl
        }
      }
    }
  }
`

const parseUser = user => {
  const avatarUrl =
    user && user.profile && user.profile.avatarUrl
      ? createAppUrl(user.profile.avatarUrl)
      : ''
  const models = user.models ? user.models.map(parseModel) : []
  const likedModels = user.likedModels ? user.likedModels.map(parseModel) : []
  return {
    ...user,
    models,
    likedModels,
    profile: {
      ...user.profile,
      avatarUrl,
    },
  }
}

const parseUserPayload = data => {
  if (!data || !data.user) {
    return null
  }

  return parseUser(data.user)
}

const useUpdateUser = () => {
  return useMutation(UPDATE_USER_MUTATION)
}

const useUploadUserAvatarMutation = (user, croppedImg) => {
  return useMutation(UPLOAD_USER_PROFILE_AVATAR_MUTATION, {
    variables: {
      file: croppedImg,
      userId: user.id,
    },
    refetchQueries: [
      {
        query: USER_QUERY,
        variables: {
          id: user.id,
        },
      },
    ],
  })
}

export const useDeleteUserAvatarMutation = user => {
  return useMutation(
    gql`
      mutation deleteUserProfileAvatar($userId: ID) {
        deleteUserProfileAvatar(userId: $userId) {
          user {
            id
          }
        }
      }
    `,
    {
      variables: {
        userId: user.id,
      },
      refetchQueries: [
        {
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
        },
      ],
    }
  )
}

export const useFollowUserMutation = user => {
  return useMutation(
    gql`
      mutation followUser($id: ID!) {
        followUser(id: $id) {
          ok
        }
      }
    `,
    {
      variables: {
        id: user.id,
      },
      refetchQueries: [
        {
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
        },
      ],
    }
  )
}

export const useUnfollowUserMutation = user => {
  return useMutation(
    gql`
      mutation unfollowUser($id: ID!) {
        unfollowUser(id: $id) {
          ok
        }
      }
    `,
    {
      variables: {
        id: user.id,
      },
      refetchQueries: [
        {
          query: USER_QUERY,
          variables: {
            id: user.id,
          },
        },
      ],
    }
  )
}

export { useUpdateUser, useUploadUserAvatarMutation, parseUser }
