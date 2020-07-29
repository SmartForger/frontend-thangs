import React from 'react'
import TeamCreateModal from './'
import { action } from '@storybook/addon-actions'
import { authenticationService } from '@services'
import { withApolloProvider } from '../../../.storybook/withApolloProvider'
import { CREATE_FOLDER_MUTATION } from '../../../src/@services/graphql-service/folders'
import { USER_QUERY } from '../../../src/@services/graphql-service/users'

export default {
  title: 'TeamCreateModal',
  component: TeamCreateModal,
}

export const Successful = () => {
  authenticationService.getCurrentUserId = () => '1111'
  return (
    <TeamCreateModal
      isOpen
      onCancel={action('cancel button clicked')}
      afterCreate={action('save button clicked')}
    ></TeamCreateModal>
  )
}
Successful.story = {
  decorators: [
    withApolloProvider({
      requestMockHandlers: {
        queries: [{ type: USER_QUERY, data: { user: {} } }],
        mutations: [
          {
            type: CREATE_FOLDER_MUTATION,
            data: { createFolder: {} },
          },
        ],
      },
    }),
  ],
}

export const Error = () => {
  authenticationService.getCurrentUserId = () => '1111'
  return (
    <TeamCreateModal
      onCancel={action('cancel button clicked')}
      afterCreate={action('save button clicked')}
      isOpen
    ></TeamCreateModal>
  )
}
Error.story = {
  decorators: [
    withApolloProvider({
      requestMockHandlers: {
        queries: [{ type: USER_QUERY, data: { user: {} } }],
        mutations: [
          {
            type: CREATE_FOLDER_MUTATION,
            data: () => {
              throw new Error('error in backend')
            },
          },
        ],
      },
    }),
  ],
}
