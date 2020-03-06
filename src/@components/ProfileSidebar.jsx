import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Button, ChangeablePicture } from '@components';
import * as GraphqlService from '@services/graphql-service';

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

    const graphqlService = GraphqlService.getInstance();
    const [updateUser, { called, loading }] = graphqlService.useUpdateUser();

    async function formSubmit(data, e) {
        e.preventDefault();
        const update = { ...user, ...data };
        try {
            await updateUser({
                variables: {
                    updateInput: {
                        ...update,
                        profile: { description: 'description updated' },
                    },
                },

                // We need this update mechanism because our user query returns a
                // string id, while the user mutation returns an integer id.
                // This messes up Apollo's caching, so we need to handle it ourselves.
                update: (store, { data: { updateUser } }) => {
                    store.writeQuery({
                        query: GraphqlService.USER_QUERY,
                        variables: { id: `${updateUser.id}`, test: 4 },
                        data: { user: updateUser },
                    });
                },
            });
        } catch (error) {
            console.error('Error when trying to update the user', error);
        }

        onSubmit(data, e);
    }

    return (
        <FormStyled onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}>
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
                <ChangeablePicture />
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
