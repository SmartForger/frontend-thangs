import React from 'react';
import Avatar from 'react-avatar';

const DEFAULT_AVATAR_SIZE = '250px';
const DEFAULT_AVATAR_COLOR = '#616168';

export function ProfilePicture({
    user,
    size = DEFAULT_AVATAR_SIZE,
    color = DEFAULT_AVATAR_COLOR,
}) {
    const avatarName = user.fullName;
    const src = user.profile && user.profile.avatarUrl;

    return (
        <Avatar
            name={avatarName}
            src={src}
            color={color}
            size={size}
            round={true}
            maxInitials={2}
        />
    );
}
