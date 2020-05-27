import React from 'react';
import styled from 'styled-components';
import { ProfilePicture } from './ProfilePicture';

const UserContainerInline = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const UserNameInline = styled.span`
    margin-left: 16px;
`;

export function UserInline({ user, className, size = '24px' }) {
    return (
        <UserContainerInline className={className}>
            <ProfilePicture
                size={size}
                name={user.fullName}
                src={user.profile.avatarUrl}
            />
            <UserNameInline>{user.fullName}</UserNameInline>
        </UserContainerInline>
    );
}
