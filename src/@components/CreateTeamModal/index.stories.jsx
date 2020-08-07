import React from 'react'
import CreateTeamModal from './'
import { action } from '@storybook/addon-actions'
import { authenticationService } from '@services'
import { withApolloProvider } from '../../../.storybook/withApolloProvider'
import { CREATE_FOLDER_MUTATION } from '../../../src/@services/graphql-service/folders'
import { USER_QUERY } from '../../../src/@services/graphql-service/users'

export default {
  title: 'CreateTeamModal',
  component: CreateTeamModal,
}

export const Successful = () => {
  authenticationService.getCurrentUserId = () => '1111'
  return (
    <CreateTeamModal
      isOpen
      onCancel={action('cancel button clicked')}
      afterCreate={action('save button clicked')}
    ></CreateTeamModal>
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
    <CreateTeamModal
      onCancel={action('cancel button clicked')}
      afterCreate={action('save button clicked')}
      isOpen
    ></CreateTeamModal>
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
