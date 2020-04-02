import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style/Layout';
import { useCurrentUser } from '@customHooks/Users';
import { ProfilePicture } from '@components/ProfilePicture';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const Name = styled.div`
    font-family: ${props => props.theme.mainFont};
    font-size: 24px;
    color: ${props => props.theme.profileNameColor};
`;

const Row = styled.div`
    display: flex;
    align-items: center;
`;

const ProfilePictureStyled = styled(ProfilePicture)`
    margin-right: 24px;
`;

const allowCssProp = props => (props.css ? props.css : '');

const Button = styled.button`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.primaryButton};
    font-size: 14px;
    padding: 8px 36px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;

    ${props => props.theme.shadow};
    ${allowCssProp};
`;

const DeleteButton = styled.button`
    color: ${props => props.theme.primaryButtonText};
    background-color: ${props => props.theme.deleteButton};
    padding: 8px 24px;
    border: none;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-weight: bold;
    font-size: 14px;

    ${props => props.theme.shadow};
`;

function PictureForm({ user, className }) {
    return (
        <Row className={className}>
            <ProfilePictureStyled user={user} size="80px" />
            <Button
                css={`
                    margin-right: 8px;
                `}
            >
                Upload New Photo
            </Button>
            <DeleteButton>Delete</DeleteButton>
        </Row>
    );
}

const PictureFormStyled = styled(PictureForm)`
    margin-top: 64px;
`;

function InlineProfile({ user }) {
    return (
        <Row>
            <ProfilePictureStyled user={user} size="50px" />
            <Name>{user.fullName}</Name>
        </Row>
    );
}

const FormStyled = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 520px;
`;
const NameField = styled.div`
    display: flex;
    justify-content: space-between;
`;
const FullWidthInput = styled.input`
    display: block;
    flex-grow: 1;
    border: 0;
    padding: 8px 16px;
    margin-bottom: 8px;
    border-radius: 8px;
    min-width: 0;
    font-family: ${props => props.theme.buttonFont};
    font-size: 14px;

    ${allowCssProp};
`;
const TextArea = styled.textarea`
    resize: vertical;
    border: 0;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-size: 14px;

    ${allowCssProp};
`;

function EditProfileForm({ user }) {
    const { register, handleSubmit, errors } = useForm();
    const [updateUser] = graphqlService.useUpdateUser(user);
    const [saved, setSaved] = useState(false);

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

        setSaved(true);
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
                        margin-right: 8px;
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
                css={`
                    margin-bottom: 32px;
                `}
            />

            <Button type="submit" disabled={R.empty(errors)}>
                Save Changes
            </Button>
        </FormStyled>
    );
}

function Page() {
    const { user } = useCurrentUser();

    if (!user) {
        return null;
    }

    return (
        <div>
            <InlineProfile user={user} />
            <PictureFormStyled user={user} />
            <EditProfileForm user={user} />
        </div>
    );
}

const EditProfile = WithNewThemeLayout(Page);

export { EditProfile };
