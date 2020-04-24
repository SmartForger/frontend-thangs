import React from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import * as EmailValidator from 'email-validator';

import * as swearjar from '@utilities';
import { Button, Spinner, TextInput as BaseTextInput } from '@components';
import { WithNewSignupThemeLayout } from '@style';
import { useForm } from '@customHooks';
import { authenticationService } from '@services';
import { ReactComponent as UserRegistrationIcon } from '@svg/user-registration.svg';
import { darkPageTitleText } from '@style/text';

const InlinedSpinner = styled(Spinner)`
    display: inline-block;
`;

const PageHeader = styled.h1`
    ${darkPageTitleText};
    margin-top: 8px;
`;

const Container = styled.div`
    width: 500px;
    margin: auto;
    margin-top: 104px;
`;

const FieldContainer = styled.div`
    display: flex;
    flex-flow: column nowrap;
`;

const ErrorTextStyle = styled.h4`
    margin-top: 24px;
    color: ${props => props.theme.errorTextColor};
    background-color: ${props => props.theme.errorTextBackground};
    font-weight: 500;
    padding: 10px 16px;
    border-radius: 8px;
`;

const TextInput = styled(BaseTextInput)`
    width: 100%;
    margin-top: 8px;
`;

const FormControl = styled.div`
    margin-top: 32px;
    width: 100%;
`;

const SubmitContainer = styled.div`
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SubmitButton = styled(Button)`
    margin: 0;
`;

const Page = () => {
    const [waiting, setWaiting] = React.useState(false);
    const [signupErrorMessage, setSignupErrorMessage] = React.useState(null);
    const [invalidFields, setInvalidFields] = React.useState([]);
    const { inputs, handleChange, handleSubmit } = useForm(signup);

    const history = useHistory();
    const { registrationCode } = useParams();

    async function signup() {
        setWaiting(true);
        setSignupErrorMessage(null);

        const response = await authenticationService.signup({
            email: inputs.email,
            password: inputs.password,
            registration_code: registrationCode,
            first_name: inputs.firstName,
            last_name: inputs.lastName,
            username: inputs.username,
        });

        setWaiting(false);
        if (response.status !== 201) {
            const fields = Object.keys(response.data);
            setInvalidFields(fields);
            setSignupErrorMessage(response.data[fields[0]]);
        } else {
            await authenticationService.login({
                email: inputs.email,
                password: inputs.password,
            });
            history.push('/');
        }
    }

    const setFieldToValid = fieldName => {
        if (invalidFields.indexOf(fieldName) !== -1) {
            const temp = [...invalidFields];
            temp.splice(invalidFields.indexOf(fieldName), 1);
            setInvalidFields(temp);
            setSignupErrorMessage('');
        }
    };

    const needsCorrected = field => {
        if (invalidFields.indexOf(field) !== -1) return true;
        return false;
    };

    const invalidForm = () => {
        if (!registrationCode) {
            return false;
        }
        if (
            inputs.firstName &&
            inputs.lastName &&
            inputs.username &&
            inputs.email &&
            inputs.password &&
            inputs.password === inputs.confirmPass
        ) {
            return false;
        }
        return true;
    };

    const validateUsername = () => {
        if (swearjar.profane(inputs.username)) {
            setInvalidFields(['username']);
            setSignupErrorMessage(
                'Sorry, we detected profanity in your username!'
            );
            return false;
        } else {
            setFieldToValid('username');
            return true;
        }
    };

    const validateEmail = () => {
        if (!EmailValidator.validate(inputs.email)) {
            setInvalidFields(['email']);
            setSignupErrorMessage('Please enter a valid e-mail address');
            return false;
        } else {
            setFieldToValid('email');
            return true;
        }
    };

    const validatePasswords = () => {
        if (inputs.confirmPass !== inputs.password) {
            setInvalidFields(['password']);
            setSignupErrorMessage('Please ensure that both passwords match');
            return false;
        } else {
            setFieldToValid('password');
            return true;
        }
    };

    return (
        <Container>
            <form onSubmit={handleSubmit} data-cy="signup-form">
                <UserRegistrationIcon />
                <PageHeader>
                    Register {waiting && <InlinedSpinner size="30" />}
                </PageHeader>
                {!!signupErrorMessage && (
                    <ErrorTextStyle data-cy="signup-error">
                        {signupErrorMessage}
                    </ErrorTextStyle>
                )}
                <FieldContainer>
                    <FormControl>
                        <label>
                            First Name
                            <TextInput
                                id="first-name-input"
                                type="text"
                                name="firstName"
                                onChange={handleChange}
                                value={inputs.firstName || ''}
                                data-cy="signup-first-name"
                            />
                        </label>
                    </FormControl>
                    <FormControl>
                        <label>
                            Last Name
                            <TextInput
                                id="last-name-input"
                                type="text"
                                name="lastName"
                                onChange={handleChange}
                                value={inputs.lastName || ''}
                                data-cy="signup-last-name"
                            />
                        </label>
                    </FormControl>
                    <FormControl>
                        <label>
                            Username
                            <TextInput
                                id="username-input"
                                type="text"
                                name="username"
                                incorrect={needsCorrected('username')}
                                onChange={handleChange}
                                validator={validateUsername}
                                value={inputs.username || ''}
                                data-cy="signup-username"
                                required
                            />
                        </label>
                    </FormControl>
                    <FormControl>
                        <label>
                            Email
                            <TextInput
                                id="email-input"
                                type="text"
                                name="email"
                                incorrect={needsCorrected('email')}
                                onChange={handleChange}
                                validator={validateEmail}
                                value={inputs.email || ''}
                                data-cy="signup-email"
                                required
                            />
                        </label>
                    </FormControl>
                    <FormControl>
                        <label>
                            Password
                            <TextInput
                                id="password-input"
                                type="password"
                                name="password"
                                onChange={handleChange}
                                value={inputs.password || ''}
                                data-cy="signup-password"
                                required
                            />
                        </label>
                    </FormControl>
                    <FormControl>
                        <label>
                            Confirm Password
                            <TextInput
                                id="confirm-password-input"
                                type="password"
                                name="confirmPass"
                                onChange={handleChange}
                                value={inputs.confirmPass || ''}
                                validator={validatePasswords}
                                data-cy="signup-confirm-password"
                                required
                            />
                        </label>
                    </FormControl>
                </FieldContainer>
                <SubmitContainer>
                    <p>
                        By clicking the submit button, you agree <br />
                        to the{' '}
                        <a href="/terms_and_conditions" target="_blank">
                            terms and conditions
                        </a>{' '}
                        of this site.
                    </p>
                    <SubmitButton
                        type="submit"
                        name="Submit"
                        disabled={waiting || invalidForm()}
                    />
                </SubmitContainer>
            </form>
        </Container>
    );
};

export const Signup = WithNewSignupThemeLayout(Page);
