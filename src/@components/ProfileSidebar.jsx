import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, ChangeablePicture, Markdown } from '@components';
import { ProfilePicture } from '@components/ProfilePicture';
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

const EditButton = ({ onClick }) => {
    return (
        <Button
            name="Edit Profile"
            css={`
                max-width: 100%;
            `}
            onClick={onClick}
        />
    );
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
    const [updateUser] = graphqlService.useUpdateUser();

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

const EditableProfile = ({ user }) => {
    const [isEditing, setIsEditing] = useState(false);
    const startEditProfile = () => setIsEditing(true);
    const endEditProfile = () => setIsEditing(false);
    return (
        <>
            <ChangeablePicture user={user} />
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
                        <EditButton onClick={startEditProfile} />
                        <Markdown>{user.profile.description}</Markdown>
                        <InviteCode code={user.inviteCode} />
                    </>
                )}
            </UserDetails>
        </>
    );
};

const InviteCodeBox = styled.div`
    background-color: ${props => props.theme.white};
    padding: 4px;
    border-radius: 4px;
    text-align: center;
`;

const CopyButton = ({ code }) => {
    const [copied, setCopied] = useState(false);

    if (copied) {
        return <button disabled>copied</button>;
    }

    const handleCopy = () => setCopied(true);
    return (
        <CopyToClipboard text={code} onCopy={handleCopy}>
            <button>copy</button>
        </CopyToClipboard>
    );
};
const InviteCode = ({ code }) => {
    if (!code) {
        return null;
    }

    return (
        <InviteCodeBox>
            Share your invite code! {code} <CopyButton code={code} />
        </InviteCodeBox>
    );
};

const StaticProfile = ({ user }) => {
    return (
        <>
            <ProfilePicture user={user} />
            <UserDetails>
                <div>{user.username}</div>
                <div>{user.email}</div>
                <div>
                    {user.firstName} {user.lastName}
                </div>
                <Markdown>{user.profile.description}</Markdown>
                <InviteCode code={user.inviteCode} />
            </UserDetails>
        </>
    );
};

export const ProfileSidebar = ({ user, isCurrentUser }) => {
    return (
        <SidebarStyled>
            <SocialStyled>
                {isCurrentUser ? (
                    <EditableProfile user={user} />
                ) : (
                    <StaticProfile user={user} />
                )}
            </SocialStyled>
        </SidebarStyled>
    );
};
