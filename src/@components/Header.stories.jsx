import React, { useState, useEffect } from 'react';
import { Header as HeaderComponent } from './Header';

import { USER_QUERY } from '../@services/graphql-service/users';
import { withApolloProvider } from '../../.storybook/withApolloProvider';

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
    isBeingFollowedByRequester: false,
};

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
};

export default {
    title: 'Header',
    component: Header,
    decorators: [withApolloProvider({ requestMockHandlers })],
};

export function Header() {
    return <HeaderComponent />;
}

export function HeaderLogoOnly() {
    return <HeaderComponent variant="logo-only" />;
}

export function HeaderInverted() {
    return <HeaderComponent inverted={true} />;
}

export function HeaderLogoOnlyInverted() {
    return <HeaderComponent variant="logo-only" inverted={true} />;
}

export function HeaderAuthenticated() {
    useMockCurrentUser(MOCK_USER);
    return <HeaderComponent />;
}

export function HeaderAuthenticatedInverted() {
    useMockCurrentUser(MOCK_USER);
    return <HeaderComponent inverted={true} />;
}

// TODO: This is a pretty messy hack to simulate authentication. And it still
//       suffers from Storybook's component caching.
function useMockCurrentUser(mockUser) {
    const [currentUser, setMockCurrentUser] = useState();
    useEffect(() => {
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        // State setter only used to trigger re-render.
        setMockCurrentUser(mockUser);
        const clearCurrentUser = () => localStorage.removeItem('currentUser');
        setTimeout(clearCurrentUser, 0);
        return clearCurrentUser;
    }, [mockUser]);
    return currentUser;
}
