import React, { useState } from 'react';
import { useHistory, useRouteMatch, Link } from 'react-router-dom';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import { authenticationService } from '@services';
import { useForm } from '@customHooks';
import { BasicPageStyle } from '@style';
import { TextInput, Spinner, Button } from '@components';

const SignupBodyStyle = styled(BasicPageStyle)`
    position: fixed;
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
        });

        if (response.status !== 201) {
            setWaiting(false);
            setSignupErrorMessage(response.data.reason);
            setInvalidFields(response.data.fields || '');
        } else {
            const loginResponse = await authenticationService.login({
                email: inputs.email,
                password: inputs.password,
            });
            setWaiting(false);
        }

        // .then(s => {
        //     setWaiting(false);
        //     setSignupErrorMessage(s.status);
        //     history.push('/login');
        // });
    }

    const isFieldInvalid = fieldName => {
        return invalidFields.indexOf(fieldName) !== -1;
    };

    const setFieldToValid = fieldName => {
        if (invalidFields.indexOf(fieldName) !== -1) {
            const temp = [...invalidFields];
            temp.splice(invalidFields.indexOf(fieldName), 1);
            setInvalidFields(temp);
            setSignupErrorMessage('');
        }
    };

    const canSignup = () => {
        if (
            inputs.password &&
            inputs.email &&
            inputs.password === inputs.confirmPass &&
            invalidFields.length == 0
        ) {
            return false;
        }
        return true;
    };

    const validateRegistration = () => {
        setFieldToValid('registration_code');
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

    const validateEmail = () => {
        if (!EmailValidator.validate(inputs.email)) {
            setInvalidFields(['email']);
            setSignupErrorMessage('Please enter a valid e-mail address');
        } else {
            setFieldToValid('email');
        }
    };

    return (
        <SignupBodyStyle>
            <SignupFormStyle onSubmit={handleSubmit}>
                {waiting ? <Spinner size="300" /> : <h3>Signup</h3>}
                {signupErrorMessage ? (
                    <ErrorTextStyle>{signupErrorMessage}</ErrorTextStyle>
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
                        onChange={handleChange}
                        onBlur={validateRegistration}
                        value={inputs.registrationCode}
                        // invalid={isFieldInvalid('registration_code')}
                        placeholder="Registration Code"
                    />
                )}
                <TextInput
                    disabled={waiting}
                    type="text"
                    name="firstName"
                    label="First Name"
                    onChange={handleChange}
                    value={inputs.firstName}
                    // invalid={isFieldInvalid('first_name')}
                    placeholder="First Name"
                />
                <TextInput
                    disabled={waiting}
                    type="text"
                    name="lastName"
                    label="Last Name"
                    onChange={handleChange}
                    value={inputs.lastName}
                    // invalid={isFieldInvalid('last_name')}
                    placeholder="Last Name"
                />
                <TextInput
                    disabled={waiting}
                    type="text"
                    name="email"
                    label="E-Mail"
                    onChange={handleChange}
                    onBlur={validateEmail}
                    value={inputs.email}
                    // invalid={isFieldInvalid('email')}
                    placeholder="E-mail"
                    required
                />
                <TextInput
                    disabled={waiting}
                    type="password"
                    name="password"
                    label="Password"
                    onChange={handleChange}
                    value={inputs.password}
                    // invalid={isFieldInvalid('password')}
                    placeholder="Password"
                    required
                />
                <TextInput
                    disabled={waiting}
                    type="password"
                    name="confirmPass"
                    label="Password"
                    onChange={handleChange}
                    //onBlur={validatePasswords}
                    value={inputs.confirmPass}
                    validator={validatePasswords}
                    // invalid={isFieldInvalid('password')}
                    placeholder="Confirm password"
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
    );
};

export { Signup };
