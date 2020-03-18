import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { Button, ChangeablePicture, Markdown } from '@components';
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

const UserDetails = styled.div`
    width: 100%;
`;

const allowCssProp = props => (props.css ? props.css : '');

const isEmpty = obj =>
    Object.keys(obj).length === 0 && obj.constructor === Object;

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
    display: block;
    flex-grow: 1;
    border: 0;
    padding: 4px;
    margin-bottom: 4px;
    border-radius: 4px;
    min-width: 0;

    ${allowCssProp};
`;

const NameField = styled.div`
    display: flex;
    justify-content: space-between;
`;

const TextArea = styled.textarea`
    resize: vertical;
    border: 0;
    padding: 4px;
    border-radius: 4px;
`;

const ButtonGroup = styled.div`
    margin-top: 4px;
    display: flex;
`;

const EditProfileForm = ({ onClose, user }) => {
    const { register, handleSubmit, errors } = useForm();

    const graphqlService = GraphqlService.getInstance();
    const [updateUser] = graphqlService.useUpdateUser(user);

    function handleCancel() {
        onClose();
    }

    async function formSubmit(data, e) {
        e.preventDefault();

        const updateInput = {
            id: user.id,
            firstName: data.firstName,
            lastName: data.lastName,
            profile: {
                description: data.description,
            },
        };

        try {
            await updateUser({
                variables: { updateInput },
            });
        } catch (error) {
            console.error('Error when trying to update the user', error);
        }

        onClose(data, e);
    }

    return (
        <FormStyled onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}>
            <NameField>
                <FullWidthInput
                    name="firstName"
                    defaultValue={user.firstName}
                    ref={register({ required: true })}
                    placeholder="First Name"
                    css={`
                        margin-right: 4px;
                    `}
                />
                <FullWidthInput
                    name="lastName"
                    defaultValue={user.lastName}
                    ref={register({ required: true })}
                    placeholder="Last Name"
                />
            </NameField>
            <TextArea
                name="description"
                defaultValue={user.profile.description}
                ref={register({ required: true })}
                placeholder="Add a bio..."
            />

            <ButtonGroup>
                <Button name="Save" type="submit" disabled={!isEmpty(errors)} />
                <Button name="Cancel" onClick={e => handleCancel(e)} />
            </ButtonGroup>
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
                <ChangeablePicture user={user} src={user.profile.avatar} />
                <UserDetails>
                    <div>{user.username}</div>
                    <div>{user.email}</div>
                    {isEditing ? (
                        <EditProfileForm onClose={endEditProfile} user={user} />
                    ) : (
                        <>
                            <div>
                                {user.firstName} {user.lastName}
                            </div>
                            <FollowOrEditButton onClick={startEditProfile} />
                            <Markdown>{user.profile.description}</Markdown>
                        </>
                    )}
                </UserDetails>
            </SocialStyled>
        </SidebarStyled>
    );
};
