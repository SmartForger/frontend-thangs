import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import { authenticationService } from '@services';
import { useForm } from '@customHooks';
import { BasicPageStyle } from '@style';
import { TextInput, Spinner, Button } from '@components';

const ErrorTextStyle = styled.h3`
    font-weight: bold;
    color: red;
`;

const LoginBodyStyle = styled(BasicPageStyle)`
    position: fixed;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const LoginFormStyle = styled.form`
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const Login = () => {
    const [waiting, setWaiting] = useState(false);
    const [loginErrorMessage, setLoginErrorMessage] = useState(null);
    const { inputs, handleChange, handleSubmit } = useForm(login);
    const [invalidFields, setInvalidFields] = useState([]);
    const history = useHistory();

    const setFieldToValid = fieldName => {
        if (invalidFields.indexOf(fieldName) !== -1) {
            const temp = [...invalidFields];
            temp.splice(invalidFields.indexOf(fieldName), 1);
            setInvalidFields(temp);
            setLoginErrorMessage('');
        }
    };

    const validateEmail = () => {
        if (!EmailValidator.validate(inputs.email)) {
            setInvalidFields(['email']);
            setLoginErrorMessage('Please enter a valid e-mail address');
            return false;
        } else {
            setFieldToValid('email');
            return true;
        }
    };

    const needsCorrected = field => {
        if (invalidFields.indexOf(field) !== -1) return true;
        return false;
    };

    async function login() {
        setWaiting(true);
        setLoginErrorMessage(null);

        const res = await authenticationService.login({
            email: inputs.email,
            password: inputs.password,
        });

        setWaiting(false);

        if (res.status !== 200) {
            setLoginErrorMessage(res.data.detail);
        } else {
            history.push('/');
        }
    }

    const canLogin = () => {
        if (
            inputs.password &&
            inputs.email &&
            EmailValidator.validate(inputs.email)
        ) {
            return false;
        }
        return true;
    };

    return (
        <LoginBodyStyle>
            <LoginFormStyle onSubmit={handleSubmit}>
                {waiting ? <Spinner size="300" /> : <h3>Welcome Back</h3>}
                {loginErrorMessage ? (
                    <ErrorTextStyle>{loginErrorMessage}</ErrorTextStyle>
                ) : (
                    <></>
                )}
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
                    required
                />
                <Button
                    onClick={handleSubmit}
                    name="Login"
                    disabled={canLogin()}
                />
                <input
                    type="submit"
                    style={{ position: 'absolute', left: '-9999px' }}
                />
                <Link to="/signup">
                    Don't have an account? create one here!{' '}
                </Link>
            </LoginFormStyle>
        </LoginBodyStyle>
    );
};

export { Login };
