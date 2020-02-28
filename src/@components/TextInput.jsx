import React, { useState } from 'react';
import styled from 'styled-components';

const TextInputStyled = styled.input`
    width: 20%;
    padding: 12px 20px;
    margin: 8px 0;
    display: inline-block;
    border: 1px solid ${props => (props.invalid ? 'red' : '#ccc')};
    border-radius: 4px;
    box-sizing: border-box;
    font-size: 1.5rem;
    box-shadow: inset 0px 0px 0px 3px
        ${props => (props.invalid || props.incorrect ? 'red' : 'clear')};
    transition: 0.2s all;
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
