import React, { useState } from 'react';
import styled from 'styled-components';

const TextInputStyled = styled.input`
    padding: 8px 12px;
    margin: 0;
    display: inline-block;
    border: 1px solid ${props => (props.invalid ? 'red' : 'transparent')};
    border-radius: 8px;
    box-sizing: border-box;
    line-height: 18px;
    background-color: ${props => props.theme.textInputBackground};
    color: ${props => props.theme.textInputColor};

    ::placeholder {
        color: ${props => props.theme.textInputPlaceholderColor};
    }
`;

const TextInput = props => {
    const [valid, setValid] = useState(true);

    const handleValidation = () => {
        if (props.hasOwnProperty('validator')) {
            setValid(props.validator());
        }
    };

    return (
        <TextInputStyled
            {...props}
            onBlur={handleValidation}
            invalid={!valid}
        />
    );
};

export { TextInput };

/*

const validator = (fieldName,invalidFieldsArray) => {

}

const isFieldInvalid = fieldName => {
    return invalidFields.indexOf(fieldName) !== -1;
};

const validator = () => {
    if value == blah
        setFieldToValid('registration_code');
    };



    func() -> void {
        onBlur check if the field is legit

        setState(true / false)
    }

    func() -> bool {
        determine if the field is legit
    }
*/
