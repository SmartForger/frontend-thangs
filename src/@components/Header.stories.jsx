import React, { useState, useEffect } from 'react'
import { Header as HeaderComponent } from './Header'

import { USER_QUERY } from '../@services/graphql-service/users'
import { withApolloProvider } from '../../.storybook/withApolloProvider'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(_theme => {
  return {
    UndoPageWrapper: {
      margin: '-1rem',
    },
  }
})
const MOCK_USER = {
  __typename: 'User',
  id: 9999,
  username: null,
  email: null,
  firstName: 'Testy',
  lastName: 'McTestface',
  fullName: 'Testy McTestface',
  profile: {
    description: null,
    avatarUrl: null,
  },
  inviteCode: null,
  likedModels: [],
  models: [],
  folders: [],
  isBeingFollowedByRequester: false,
}

const requestMockHandlers = {
  queries: [
    {
      type: USER_QUERY,
      data: {
        user: MOCK_USER,
      },
    },
  ],
  mutations: [],
}

const UndoPageWrapper = ({ children, ...props }) => {
  const c = useStyles()
  return (
    <div className={c.UndoPageWrapper} {...props}>
      {children}
    </div>
  )
}

export default {
  title: 'Header',
  component: Header,
  decorators: [withApolloProvider({ requestMockHandlers })],
}

export function Header() {
  return (
    <UndoPageWrapper>
      <HeaderComponent />
    </UndoPageWrapper>
  )
}

export function HeaderLogoOnly() {
  return (
    <UndoPageWrapper>
      <HeaderComponent variant='logo-only' />
    </UndoPageWrapper>
  )
}

export function HeaderInverted() {
  return (
    <UndoPageWrapper>
      <HeaderComponent inverted={true} />
    </UndoPageWrapper>
  )
}

export function HeaderLogoOnlyInverted() {
  return (
    <UndoPageWrapper>
      <HeaderComponent variant='logo-only' inverted={true} />
    </UndoPageWrapper>
  )
}

export function HeaderAuthenticated() {
  useMockCurrentUser(MOCK_USER)
  return (
    <UndoPageWrapper>
      <HeaderComponent />
    </UndoPageWrapper>
  )
}

export function HeaderAuthenticatedInverted() {
  useMockCurrentUser(MOCK_USER)
  return (
    <UndoPageWrapper>
      <HeaderComponent inverted={true} />
    </UndoPageWrapper>
  )
}

// TODO: This is a pretty messy hack to simulate authentication. And it still
//       suffers from Storybook's component caching.
function useMockCurrentUser(mockUser) {
  const [currentUser, setMockCurrentUser] = useState()
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(mockUser))
    // State setter only used to trigger re-render.
    setMockCurrentUser(mockUser)
    const clearCurrentUser = () => localStorage.removeItem('currentUser')
    setTimeout(clearCurrentUser, 0)
    return clearCurrentUser
  }, [mockUser])
  return currentUser
}
