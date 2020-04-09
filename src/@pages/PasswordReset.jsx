import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import * as EmailValidator from 'email-validator';
import { authenticationService } from '@services';
import { useForm } from '@customHooks';
import { TextInput as BaseTextInput, Spinner, Button } from '@components';
import { WithNewSignupThemeLayout } from '@style';

const InlinedSpinner = styled(Spinner)`
    display: inline-block;
`;

const TextInput = styled(BaseTextInput)`
    display: block;
    width: 100%;
`;

const ErrorTextStyle = styled.h4`
    margin-top: 16px;
    color: #c82020;
    background-color: #ddb6b6;
    padding: 4px;
    border-radius: 2px;
`;

const SuccessTextStyle = styled.h4`
    color: green;
    background-color: lightgreen;
    padding: 5px;
    border-radius: 2px;
    margin-top: 5px;
`;

const LoginBodyStyle = styled.div`
    width: 500px;
    margin: auto;
`;

const LoginFieldsStyle = styled.div`
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    margin-top: 32px;
`;

const SubmitButton = styled(Button)`
    border-radius: 2px;
    margin: 0;
    margin-top: 32px;
    float: right;
`;

const FormControl = styled.div`
    margin-top: 8px;
    width: 100%;
`;

const ServerErrors = ({ errors }) => (
    <ul>
        {Object.entries(errors).flatMap(([errKey, msgList]) =>
            msgList.map((errorMessage, i) => (
                <li key={`${errKey}-${i}`}>{errorMessage}</li>
            ))
        )}
    </ul>
);
const ResetPage = () => {
    const [waiting, setWaiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { inputs, handleChange, handleSubmit } = useForm(resetPassword);
    const [invalidFields, setInvalidFields] = useState([]);
    const [isSuccess, setIsSuccess] = useState(false);

    const setFieldToValid = fieldName => {
        if (invalidFields.indexOf(fieldName) !== -1) {
            const temp = [...invalidFields];
            temp.splice(invalidFields.indexOf(fieldName), 1);
            setInvalidFields(temp);
            setErrorMessage('');
        }
    };
    const validateEmail = () => {
        if (!EmailValidator.validate(inputs.email)) {
            setInvalidFields(['email']);
            setErrorMessage('Please enter a valid e-mail address');
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

    async function resetPassword() {
        setWaiting(true);
        setErrorMessage(null);
        setIsSuccess(false);

        try {
            await authenticationService.resetPasswordForEmail(inputs.email);
            setIsSuccess(true);
        } catch (e) {
            setErrorMessage(
                e?.response?.data ? (
                    <ServerErrors errors={e.response.data} />
                ) : (
                    'Unknown error. Try again.'
                )
            );
        } finally {
            setWaiting(false);
        }
    }

    return (
        <LoginBodyStyle>
            <h1>Reset Password {waiting && <InlinedSpinner size="30" />}</h1>
            {!!errorMessage && (
                <ErrorTextStyle data-cy="reset-error">
                    {errorMessage}
                </ErrorTextStyle>
            )}
            {!!isSuccess && (
                <SuccessTextStyle>Email with reset link sent!</SuccessTextStyle>
            )}
            <form onSubmit={handleSubmit} data-cy="reset-form">
                <LoginFieldsStyle>
                    <FormControl>
                        <label>
                            E-Mail
                            <TextInput
                                disabled={waiting}
                                type="text"
                                name="email"
                                incorrect={needsCorrected('email')}
                                onChange={handleChange}
                                validator={validateEmail}
                                value={inputs.email}
                                required
                            />
                        </label>
                    </FormControl>
                </LoginFieldsStyle>
                <SubmitButton
                    name={isSuccess ? 'Re-send Email' : 'Email Reset Link'}
                    type="submit"
                    disabled={
                        !(inputs.email && EmailValidator.validate(inputs.email))
                    }
                />
            </form>
        </LoginBodyStyle>
    );
};

const ConfirmResetPage = () => {
    const [waiting, setWaiting] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { inputs, handleChange, handleSubmit } = useForm(resetPassword);
    const history = useHistory();
    const { userId, token } = useParams();

    async function resetPassword() {
        setWaiting(true);
        setErrorMessage(null);

        try {
            await authenticationService.setPasswordForReset({
                ...inputs,
                token,
                userId,
            });

            history.push('/');
        } catch (e) {
            setErrorMessage(
                e?.response?.data ? (
                    <ServerErrors errors={e.response.data} />
                ) : (
                    'Unknown error. Try again.'
                )
            );
        } finally {
            setWaiting(false);
        }
    }

    return (
        <LoginBodyStyle>
            <h1>Set New Password {waiting && <InlinedSpinner size="30" />}</h1>
            {!!errorMessage && (
                <ErrorTextStyle data-cy="confirm-reset-error">
                    {errorMessage}
                </ErrorTextStyle>
            )}
            <form onSubmit={handleSubmit} data-cy="confirm-reset-form">
                <LoginFieldsStyle>
                    <FormControl>
                        <label>
                            Password
                            <TextInput
                                disabled={waiting}
                                type="password"
                                name="password"
                                onChange={handleChange}
                                value={inputs.password || ''}
                                required
                            />
                        </label>
                    </FormControl>
                    <FormControl>
                        <label>
                            Confirm Password
                            <TextInput
                                disabled={waiting}
                                type="password"
                                name="confirmPassword"
                                onChange={handleChange}
                                value={inputs.confirmPassword || ''}
                                required
                            />
                        </label>
                    </FormControl>
                </LoginFieldsStyle>
                <SubmitButton
                    name="Submit"
                    type="submit"
                    disabled={!(inputs.password && inputs.confirmPassword)}
                />
            </form>
        </LoginBodyStyle>
    );
};

export const PasswordReset = WithNewSignupThemeLayout(ResetPage);
export const ConfirmPasswordReset = WithNewSignupThemeLayout(ConfirmResetPage);
