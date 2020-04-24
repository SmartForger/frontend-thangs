import React from 'react';
import styled from 'styled-components';
import { ProfilePicture } from './ProfilePicture';
import { usernameText } from '@style/text';

const UserContainerInline = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 8px 0;
`;

const UserNameInline = styled.span`
    ${usernameText};
    margin-left: 16px;
`;

export function UserInline({ user, className, size = '24px' }) {
    return (
        <UserContainerInline className={className}>
            <ProfilePicture size={size} user={user} />
            <UserNameInline>{user.fullName}</UserNameInline>
        </UserContainerInline>
    );
}
