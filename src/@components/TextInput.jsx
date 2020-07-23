import React, { useState } from 'react'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    TextInput: {
      padding: '.5rem .75rem',
      margin: 0,
      display: 'inline-block',
      border: '2px solid',
      borderColor: ({ invalid }) => (invalid ? theme.color.error : 'transparent'),
      borderRadius: '.5rem',
      boxSizing: 'border-box',
      lineHeight: '18px',
      fontWeight: '500',
      backgroundColor: theme.color.textInputBackground,
      color: ({ invalid }) => (invalid ? theme.color.error : theme.color.textInput),
      '&::placeholder': {
        color: theme.color.textInputPlaceholderColor,
      },
    },
  }
})

export const TextInput = props => {
  const [valid, setValid] = useState(true)
  const c = useStyles(props)

  const handleValidation = () => {
    if (Object.prototype.hasOwnProperty.call(props, 'validator')) {
      setValid(props.validator())
    }
  }

  return (
    <input
      {...props}
      className={c.TextInput}
      onBlur={handleValidation}
      invalid={!valid}
    />
  )
}

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
