import { useState } from 'react';

const useForm = callback => {
    const [inputs, setInputs] = useState({});

    const handleSubmit = event => {
        if (event) {
            event.preventDefault();
        }
        callback();
    };

    const handleChange = event => {
        event.persist();
        setInputs(inputs => ({
            ...inputs,
            [event.target.name]: event.target.value,
        }));
    };
    return {
        handleSubmit,
        handleChange,
        inputs,
    };
};

const useSignupValidation = setSignupErrorMessage => {
    const [invalidFields, setInvalidFields] = useState([]);

    const setFieldToValid = fieldName => {
        if (invalidFields.indexOf(fieldName) !== -1) {
            const temp = [...invalidFields];
            temp.splice(invalidFields.indexOf(fieldName), 1);
            setInvalidFields(temp);
            setSignupErrorMessage('');
        }
    };

    const validateRegistration = registration_code => {
        setFieldToValid('registration_code');
    };

    const validateUsername = username => {
        if (swearjar.profane(username)) {
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

    const validateEmail = inputs => {
        if (!EmailValidator.validate(inputs.email)) {
            setInvalidFields(['email']);
            setSignupErrorMessage('Please enter a valid e-mail address');
            return false;
        } else {
            setFieldToValid('email');
            return true;
        }
    };

    const validatePasswords = (password, confirmPass) => {
        if (confirmPass !== password) {
            setInvalidFields(['password']);
            setSignupErrorMessage('Please ensure that both passwords match');
            return false;
        } else {
            setFieldToValid('password');
            return true;
        }
    };

    const validateField = (fieldName, inputs) => {
        switch (fieldName) {
            case 'registration_code': {
                return validateRegistration(inputs.registration_code);
            }

            case 'username': {
                return validateUsername(inputs.username);
            }

            case 'email': {
                return validateEmail(inputs.email);
            }

            case 'passwords': {
                return validateUsername(inputs.password, inputs.confirmPass);
            }

            default: {
                throw new Error(`Unknown field ${fieldName}`);
            }
        }
    };

    return [invalidFields, validateField];
};

/// Implementation
//
// const SignUp = () => {
//   const signup = () => {
//     const req = {...inputs}
//     alert(JSON.stringify(req))
//   }
//   const {inputs, handleChange, handleSubmit} = useForm(signup);
//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label>First Name</label>
//         <input type="text" name="firstName" onChange={handleChange} value={inputs.firstName} required></input>
//         <label>Last Name</label>
//         <input type="text" name="lastName" onChange={handleChange} value={inputs.lastName} required></input>
//       </div>
//       <div>
//         <label>Email Address</label>
//         <input type="email" name="email" onChange={handleChange} value={inputs.email} required></input>
//       </div>
//       <div>
//         <label>Password</label>
//         <input type="password" name="password" onChange={handleChange} value={inputs.password} required></input>
//       </div>
//       <button type="submit">SignUp</button>
//     </form>
//   )
// }
export { useForm };
