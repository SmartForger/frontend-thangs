import React, { useState, useRef, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style/Layout';
import { useCurrentUser } from '@customHooks/Users';
import { ProfilePicture } from '@components/ProfilePicture';
import { Spinner } from '@components/Spinner';
import { NewChangePicture } from '@components/ChangeablePicture';
import { FlashContext } from '@components/Flash';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

const DELETE_ENABLED = true;

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
    font-weight: 500;
    cursor: pointer;

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
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;

    ${props => props.theme.shadow};
`;

function PictureForm({ user, className }) {
    const buttonRef = useRef();
    return (
        <Row className={className}>
            <ProfilePictureStyled user={user} size="80px" />
            <NewChangePicture
                user={user}
                css={`
                    margin-right: 8px;
                `}
                button={<Button ref={buttonRef}>Upload New Photo</Button>}
                buttonRef={buttonRef}
            />

            {DELETE_ENABLED && <DeleteButton>Delete</DeleteButton>}
        </Row>
    );
}

const PictureFormStyled = styled(PictureForm)`
    margin-top: 64px;

    ${allowCssProp};
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

const Field = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 16px;

    ${allowCssProp};
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
    color: ${props => props.theme.textInputColor};
    background-color: ${props => props.theme.textInputBackground};

    ${allowCssProp};
`;

const TextArea = styled.textarea`
    resize: vertical;
    border: 0;
    padding: 8px 16px;
    border-radius: 8px;
    font-family: ${props => props.theme.buttonFont};
    font-size: 14px;
    color: ${props => props.theme.textInputColor};
    background-color: ${props => props.theme.textInputBackground};

    ${allowCssProp};
`;

const SaveButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const Label = styled.label`
    margin: 8px 0;
`;

function WarningOnEmptyProfile({ user }) {
    const [, setFlash] = useContext(FlashContext);
    useEffect(() => {
        if (!user.profile.description) {
            setFlash(
                'Add information about yourself below to let others know your specialties, interests, etc.'
            );
        }
    }, [setFlash, user]);

    return null;
}

function EditProfileForm({ user }) {
    const { register, handleSubmit, errors } = useForm();
    const [updateUser] = graphqlService.useUpdateUser();
    const [currentState, setCurrentState] = useState('ready');

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
            setCurrentState('waiting');
            await updateUser({
                variables: { updateInput },
            });
        } catch (error) {
            setCurrentState('error');
            console.error('Error when trying to update the user', error);
        }
        setCurrentState('saved');
    }

    const handleChange = () => setCurrentState('ready');

    return (
        <FormStyled
            onSubmit={(data, e) => handleSubmit(formSubmit)(data, e)}
            onChange={handleChange}
        >
            <Field>
                <Label htmlFor="firstName">First Name</Label>
                <FullWidthInput
                    name="firstName"
                    defaultValue={user.firstName}
                    ref={register({ required: true })}
                    placeholder="Enter first name..."
                />
            </Field>
            <Field htmlFor="lastName">
                <Label>Last Name</Label>
                <FullWidthInput
                    name="lastName"
                    defaultValue={user.lastName}
                    ref={register({ required: true })}
                    placeholder="Enter last name..."
                />
            </Field>
            <Field
                htmlFor="description"
                css={`
                    margin-top: 48px;
                `}
            >
                <Label>About</Label>
                <TextArea
                    name="description"
                    defaultValue={user.profile.description}
                    ref={register({ required: true })}
                    placeholder="Add a bio..."
                    rows={5}
                    css={`
                        margin-bottom: 32px;
                    `}
                />
            </Field>

            <SaveButtonContainer>
                <Button
                    type="submit"
                    disabled={!R.empty(errors)}
                    css={`
                        width: 168px;
                        padding: 8px 30px;
                    `}
                >
                    {currentState === 'waiting'
                        ? 'Saving...'
                        : currentState === 'saved'
                        ? 'Saved!'
                        : currentState === 'error'
                        ? 'Error'
                        : 'Save Changes'}
                </Button>
            </SaveButtonContainer>
        </FormStyled>
    );
}

function Page() {
    const { loading, error, user } = useCurrentUser();

    if (loading) {
        return <Spinner />;
    }

    if (error || !user) {
        return (
            <div data-cy="fetch-results-error">
                Error! We were not able to load your profile. Please try again
                later.
            </div>
        );
    }

    return (
        <div>
            <WarningOnEmptyProfile user={user} />
            <InlineProfile user={user} />
            <PictureFormStyled
                user={user}
                css={`
                    margin-bottom: 64px;
                `}
            />
            <EditProfileForm user={user} />
        </div>
    );
}

const EditProfile = WithNewThemeLayout(Page);

export { EditProfile };
