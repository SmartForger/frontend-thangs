import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Button } from '@components';

const SidebarStyled = styled.div`
    grid-area: sidebar;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
`;

const SocialStyled = styled.div`
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    z-index: 1;
    pointer-events: none;
    flex-direction: column;
    > * {
        pointer-events: all;
    }
`;

const ProfilePicStyled = styled.div`
    background: grey;
    border-radius: 50%;
    height: 250px;
    width: 250px;
`;

const ModelsStyled = styled.div`
    grid-area: models;
    display: flex;
    flex-flow: row wrap;
`;

const UserDetails = styled.div`
    width: 100%;
`;

const FollowOrEditButton = ({ onClick }) => {
    // TODO if the user on this page is the logged in user, we should render a
    // Follow button.
    return <Button name="Edit Profile" maxwidth="100%" onClick={onClick} />;
};

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
`;

const FullWidthInput = styled.input`
    width: 100%;
`;

const NameField = styled.div`
    display: flex;
`;

const EditProfileForm = ({ onSubmit, user }) => {
    const { register, handleSubmit, watch, errors } = useForm();
    return (
        <FormStyled onSubmit={handleSubmit(onSubmit)}>
            <FullWidthInput
                name="username"
                defaultValue={user.username}
                ref={register}
                placeholder="Username"
            />
            <FullWidthInput
                name="email"
                defaultValue={user.email}
                ref={register}
                placeholder="Email"
            />
            <NameField>
                <FullWidthInput
                    name="firstName"
                    defaultValue={user.firstName}
                    ref={register}
                    placeholder="First Name"
                />
                <FullWidthInput
                    name="lastName"
                    defaultValue={user.lastName}
                    ref={register}
                    placeholder="Last Name"
                />
            </NameField>

            <Button name="Submit" type="submit" maxwidth="100%" />
        </FormStyled>
    );
};

export const ProfileSidebar = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const startEditProfile = () => setIsEditing(true);
    const endEditProfile = () => setIsEditing(false);
    return (
        <SidebarStyled>
            <SocialStyled>
                <ProfilePicStyled />
                <UserDetails>
                    {isEditing ? (
                        <EditProfileForm
                            onSubmit={endEditProfile}
                            user={user}
                        />
                    ) : (
                        <>
                            <div>{user.username}</div>
                            <div>{user.email}</div>
                            <div>
                                {user.firstName} {user.lastName}
                            </div>
                            <FollowOrEditButton onClick={startEditProfile} />
                        </>
                    )}
                </UserDetails>
            </SocialStyled>
        </SidebarStyled>
    );
};
