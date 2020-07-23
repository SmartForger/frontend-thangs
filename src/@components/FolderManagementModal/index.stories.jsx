import React from 'react'
import * as R from 'ramda'
import { action } from '@storybook/addon-actions'
import { withApolloProvider } from '../../../.storybook/withApolloProvider'
import { FolderManagementModal } from './'
import { USER_QUERY } from '../../@services/graphql-service/users'
import {
  FOLDER_QUERY,
  INVITE_TO_FOLDER_MUTATION,
  REVOKE_ACCESS_MUTATION,
} from '../../@services/graphql-service/folders'
import UserImgFixture from '../../../.storybook/fixtures/user-img.png'

const userFixture = {
  id: '9998',
  fullName: 'Thangs Physna',
  email: 'info@thangs.com',
  profile: {
    avatarUrl: UserImgFixture,
  },
}

const ownUser = {
  ...userFixture,
  id: '1234',
}

const folderFixture = {
  name: '4 Cylinder Engine Project',
  id: 9,
  size: 7,
  members: [
    userFixture,
    ownUser,
    {
      ...userFixture,
      id: '8888',
    },
    {
      ...userFixture,
      id: '7777',
    },
  ],
  models: [],
}

const provider = {
  requestMockHandlers: {
    queries: [
      { type: USER_QUERY, data: { user: {} } },
      {
        type: FOLDER_QUERY,
        data: () => {
          return { folder: folderFixture }
        },
      },
    ],
    mutations: [
      {
        type: REVOKE_ACCESS_MUTATION,
        data: variables => {
          const { userId } = variables
          folderFixture.members = R.reject(R.propEq('id', userId))(folderFixture.members)
          return { revokeAccess: { folder: folderFixture } }
        },
      },
      {
        type: INVITE_TO_FOLDER_MUTATION,
        data: _variables => {
          return { inviteToFolder: {} }
        },
      },
    ],
  },
}

const errorProvider = {
  requestMockHandlers: {
    queries: [],
    mutations: [
      {
        type: REVOKE_ACCESS_MUTATION,
        data: _variables => {
          throw new Error('error in backend')
        },
      },
    ],
  },
}

export default {
  title: 'FolderManagementModal',
  component: FolderManagementModal,
}

export function WithOtherUsers() {
  return (
    <FolderManagementModal
      folder={folderFixture}
      onCancel={action('cancel button clicked')}
      afterInvite={action('save button clicked')}
      isOpen
    />
  )
}

WithOtherUsers.story = {
  decorators: [withApolloProvider(provider)],
}

export function WithServerError() {
  return (
    <FolderManagementModal
      folder={folderFixture}
      onCancel={action('cancel button clicked')}
      afterInvite={action('save button clicked')}
      isOpen
    />
  )
}

WithServerError.story = {
  decorators: [withApolloProvider(errorProvider)],
}
