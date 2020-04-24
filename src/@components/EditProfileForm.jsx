import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as R from 'ramda';
import { Button as _Button } from '@components/Button';
import * as GraphqlService from '@services/graphql-service';
import { bodyCopyText } from '@style/text';

const graphqlService = GraphqlService.getInstance();

const allowCssProp = props => (props.css ? props.css : '');

const Button = styled(_Button)`
    padding: 8px 36px;
    max-width: 100%;

    ${allowCssProp};
`;

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
    background-color: ${props => props.theme.textInputBackground};

    ${bodyCopyText};

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

export function EditProfileForm({ user }) {
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
