import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import { authenticationService } from '@services';
import { useForm } from '@customHooks';
import { TextInput as BaseTextInput, Spinner, Button } from '@components';
import { WithNewSignupThemeLayout } from '@style';
import { ReactComponent as LoginIcon } from '@svg/user-login.svg';

const PageHeader = styled.h1`
    font-family: ${props => props.theme.headerFont};
    color: ${props => props.theme.headerColorOnDarkBackground};
    margin-top: 8px;
`;

const InlinedSpinner = styled(Spinner)`
    display: inline-block;
`;

const TextInput = styled(BaseTextInput)`
    display: block;
    width: 100%;
    margin-top: 8px;
`;

const ErrorTextStyle = styled.h4`
    color: #c82020;
    background-color: #ddb6b6;
    padding: 5px;
    border-radius: 2px;
`;

const LoginBodyStyle = styled.div`
    width: 500px;
    margin: auto;
    margin-top: 104px;
`;

const LoginFieldsStyle = styled.div`
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-top: 32px;
`;

const SubmitButton = styled(Button)`
    margin: 0;
    margin-top: 96px;
    float: right;
`;

const FormControl = styled.div`
    margin-top: 32px;
    width: 100%;
`;

const ForgotText = styled.div`
    margin-top: 24px;
    color: ${props => props.theme.textColorOnDarkBackground};
`;

const Label = styled.label`
    color: ${props => props.theme.formLabelColor};
`;

const Page = () => {
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
            setLoginErrorMessage(
                res.data.detail ||
                    'Sorry, we encounteed an unexpected error.  Please try again.',
            );
        } else {
            history.push('/');
        }
    }

    const invalidForm = () => {
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
            <LoginIcon />
            <PageHeader>
                Sign In {waiting && <InlinedSpinner size="30" />}
            </PageHeader>
            {!!loginErrorMessage && (
                <ErrorTextStyle data-cy="login-error">
                    {loginErrorMessage}
                </ErrorTextStyle>
            )}
            <form onSubmit={handleSubmit} data-cy="login-form">
                <LoginFieldsStyle>
                    <FormControl>
                        <Label>
                            E-Mail
                            <TextInput
                                type="text"
                                name="email"
                                incorrect={needsCorrected('email')}
                                onChange={handleChange}
                                validator={validateEmail}
                                value={inputs.email}
                                data-cy="login-email"
                                required
                            />
                        </Label>
                    </FormControl>
                    <FormControl>
                        <Label>
                            Password
                            <TextInput
                                type="password"
                                name="password"
                                onChange={handleChange}
                                value={inputs.password}
                                data-cy="login-password"
                                required
                            />
                        </Label>
                    </FormControl>
                </LoginFieldsStyle>
                <SubmitButton
                    name="Sign In"
                    type="submit"
                    width="105px"
                    disabled={waiting || invalidForm()}
                />
            </form>
            <ForgotText>
                Forgot password? <Link to="/password_reset">Click here</Link> to
                reset your password.
            </ForgotText>
        </LoginBodyStyle>
    );
};

export const Login = WithNewSignupThemeLayout(Page);
