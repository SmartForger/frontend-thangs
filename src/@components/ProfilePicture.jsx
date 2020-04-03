import React from 'react';
import Avatar from 'react-avatar';
import styled from 'styled-components';

const DEFAULT_AVATAR_SIZE = '250px';
const DEFAULT_AVATAR_COLOR = '#616168';

const AvatarStyled = styled(Avatar)`
    span {
        color: ${props => props.theme.avatarInitialsColor};
    }
`;

export function ProfilePicture({
    className,
    user,
    size = DEFAULT_AVATAR_SIZE,
    color = DEFAULT_AVATAR_COLOR,
}) {
    const avatarName = user.fullName;
    const src = user.profile && user.profile.avatarUrl;

    return (
        <AvatarStyled
            name={avatarName}
            src={src}
            color={color}
            size={size}
            round={true}
            className={className}
            maxInitials={2}
        />
    );
}
