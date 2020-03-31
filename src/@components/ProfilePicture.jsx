import React from 'react';
import Avatar from 'react-avatar';

const DEFAULT_AVATAR_SIZE = '250px';
const DEFAULT_AVATAR_COLOR = '#616168';

const ProfilePicture = props => {
    const user = props.user;
    const size = props.size || DEFAULT_AVATAR_SIZE;
    const color = props.color || DEFAULT_AVATAR_COLOR;
    const avatarName = getUserFullName(user);
    return (
        <Avatar
            name={avatarName}
            src={user.profile.avatar}
            color={color}
            size={size}
            round={true}
        />
    );
};

export { ProfilePicture };

function getUserFullName(user) {
    const { firstName, lastName, username } = user;
    if (firstName && lastName) {
        return `${firstName} ${lastName}`;
    } else if (firstName) {
        return firstName;
    } else if (lastName) {
        return lastName;
    } else {
        return username;
    }
}
