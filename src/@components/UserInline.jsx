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
    font-size: ${props => `calc(${props.size} / 2)`};
    margin-left: 16px;
`;

export function UserInline({ user, className, size = '24px' }) {
    return (
        <UserContainerInline className={className}>
            <ProfilePicture size={size} user={user} />
            <UserNameInline size={size}>{user.fullName}</UserNameInline>
        </UserContainerInline>
    );
}
