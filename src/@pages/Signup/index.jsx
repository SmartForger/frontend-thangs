import React, { useState } from 'react';
import { useHistory, useRouteMatch, Link } from 'react-router-dom';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import * as swearjar from '@utilities';
import { authenticationService } from '@services';
import { useForm } from '@customHooks';
import { TextInput, Spinner, Button } from '@components';
import { WithLayout } from '@style';

const SignupBodyStyle = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 500px;
    margin: auto;
`;

const SignupFormStyle = styled.form`
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const ErrorTextStyle = styled.h3`
    font-weight: bold;
    color: red;
`;

const Signup = () => {
    const [waiting, setWaiting] = useState(false);
    const [signupErrorMessage, setSignupErrorMessage] = useState(null);
    const [invalidFields, setInvalidFields] = useState([]);
    const { inputs, handleChange, handleSubmit } = useForm(signup);
    const history = useHistory();
    const match = useRouteMatch('/signup/:registrationCode');

    async function signup() {
        setWaiting(true);
        setSignupErrorMessage(null);

        const response = await authenticationService.signup({
            email: inputs.email,
            password: inputs.password,
            registration_code: match
                ? match.params.registrationCode
                : inputs.registrationCode,
            first_name: inputs.firstName,
            last_name: inputs.lastName,
            username: inputs.username,
        });

        if (response.status !== 201) {
            setWaiting(false);
            const fields = Object.keys(response.data);
            setInvalidFields(fields);
            setSignupErrorMessage(response.data[fields[0]]);
        } else {
            await authenticationService.login({
                email: inputs.email,
                password: inputs.password,
            });
            setWaiting(false);
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

    const canSignup = () => {
        if (
            inputs.firstName &&
            inputs.lastName &&
            inputs.username &&
            inputs.email &&
            inputs.password &&
            inputs.password === inputs.confirmPass &&
            invalidFields.length === 0
        ) {
            return false;
        }
        return true;
    };

    const validateRegistration = () => {
        setFieldToValid('registration_code');
    };

    const validateUsername = () => {
        if (swearjar.profane(inputs.username)) {
            setInvalidFields(['username']);
            setSignupErrorMessage(
                'Sorry, we detected profanity in your username!',
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
        <WithLayout>
            <SignupBodyStyle>
                <SignupFormStyle onSubmit={handleSubmit} data-cy="signup-form">
                    {waiting ? <Spinner size="300" /> : <h3>Signup</h3>}
                    {signupErrorMessage ? (
                        <ErrorTextStyle data-cy="signup-error">
                            {signupErrorMessage}
                        </ErrorTextStyle>
                    ) : (
                        <></>
                    )}
                    {match ? (
                        <TextInput
                            disabled={true}
                            type="text"
                            name="registrationCode"
                            label="Registration Code"
                            value={match.params.registrationCode}
                            placeholder="Registration Code"
                        />
                    ) : (
                        <TextInput
                            disabled={waiting}
                            type="text"
                            name="registrationCode"
                            label="Registration Code"
                            incorrect={needsCorrected('registration_code')}
                            onChange={handleChange}
                            onFocus={validateRegistration}
                            value={inputs.registrationCode}
                            placeholder="Registration Code"
                            data-cy="signup-registration"
                        />
                    )}
                    <TextInput
                        disabled={waiting}
                        type="text"
                        name="firstName"
                        label="First Name"
                        onChange={handleChange}
                        value={inputs.firstName}
                        placeholder="First Name"
                        data-cy="signup-first-name"
                    />
                    <TextInput
                        disabled={waiting}
                        type="text"
                        name="lastName"
                        label="Last Name"
                        onChange={handleChange}
                        value={inputs.lastName}
                        placeholder="Last Name"
                        data-cy="signup-last-name"
                    />
                    <TextInput
                        disabled={waiting}
                        type="text"
                        name="username"
                        label="Username"
                        incorrect={needsCorrected('username')}
                        onChange={handleChange}
                        validator={validateUsername}
                        value={inputs.username}
                        placeholder="Username"
                        data-cy="signup-username"
                        required
                    />
                    <TextInput
                        disabled={waiting}
                        type="text"
                        name="email"
                        label="E-Mail"
                        incorrect={needsCorrected('email')}
                        onChange={handleChange}
                        validator={validateEmail}
                        value={inputs.email}
                        placeholder="E-mail"
                        data-cy="signup-email"
                        required
                    />
                    <TextInput
                        disabled={waiting}
                        type="password"
                        name="password"
                        label="Password"
                        onChange={handleChange}
                        value={inputs.password}
                        placeholder="Password"
                        data-cy="signup-password"
                        required
                    />
                    <TextInput
                        disabled={waiting}
                        type="password"
                        name="confirmPass"
                        label="Password"
                        onChange={handleChange}
                        value={inputs.confirmPass}
                        validator={validatePasswords}
                        placeholder="Confirm password"
                        data-cy="signup-confirm-password"
                        required
                    />
                    <Button
                        onClick={handleSubmit}
                        name="Signup"
                        disabled={canSignup()}
                    />
                    <input
                        type="submit"
                        style={{ position: 'absolute', left: '-9999px' }}
                    />
                    <Link to="/login">Already have an account?</Link>
                </SignupFormStyle>
            </SignupBodyStyle>
        </WithLayout>
    );
};

export { Signup };
