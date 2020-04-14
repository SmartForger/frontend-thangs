import React from 'react';
import styled from 'styled-components';
import { ProfilePicture } from './ProfilePicture';

const UserContainerInline = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 8px 0;
`;

const UserNameInline = styled.span`
    margin-left: 16px;
    font-weight: 500;
`;

export function UserInline({ user, className, size = '24px' }) {
    return (
        <UserContainerInline className={className}>
            <ProfilePicture size={size} user={user} />
            <UserNameInline>{user.fullName}</UserNameInline>
        </UserContainerInline>
    );
}
