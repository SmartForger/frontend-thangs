import React, { useState } from 'react'
import classnames from 'classnames'
import { createUseStyles } from '@style'

const useStyles = createUseStyles(theme => {
  return {
    TextInput: {
      padding: '.5rem .75rem',
      margin: 0,
      display: 'inline-block',
      border: '2px solid',
      borderColor: ({ invalid }) => (invalid ? theme.colors.error : 'transparent'),
      borderRadius: '.5rem',
      boxSizing: 'border-box',
      lineHeight: '18px',
      fontWeight: '500',
      backgroundColor: theme.variables.colors.textInputBackground,
      color: ({ invalid }) =>
        invalid ? theme.colors.error : theme.variables.colors.textInput,
      '&::placeholder': {
        color: theme.variables.colors.textInputPlaceholderColor,
      },
    },
  }
})

export const TextInput = ({ className, ...props }) => {
  const [valid, setValid] = useState(true)
  const c = useStyles({ invalid: !valid })

  const handleValidation = () => {
    if (Object.prototype.hasOwnProperty.call(props, 'validator')) {
      setValid(props.validator())
    }
  }

  return (
    <input
      {...props}
      className={classnames(className, c.TextInput)}
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
