import React from 'react';
import styled from 'styled-components';
import { ProfilePicture } from './ProfilePicture';

const UserContainerInline = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Info = styled.span`
    margin-left: 16px;
    flex-grow: 1;
`;

export function UserInline({
    user,
    className,
    displayEmail,
    size = '24px',
    children,
}) {
    return (
        <UserContainerInline className={className}>
            <ProfilePicture
                size={size}
                name={user.fullName}
                src={user.profile.avatarUrl}
            />
            <Info>
                <div>{user.fullName}</div>
                {displayEmail && <div>{user.email}</div>}
            </Info>
            {children}
        </UserContainerInline>
    );
}
