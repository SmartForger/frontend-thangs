import React, {useState} from 'react';
import {useHistory, useRouteMatch, Link} from 'react-router-dom';
import styled from 'styled-components';
import {authenticationService} from '@services';
import {useForm} from '@customHooks';
import {BasicPageStyle} from '@style'
import {TextInput, Spinner, Button} from '@components';



const SignupBodyStyle = styled(BasicPageStyle)`
  position: fixed;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const SignupFormStyle = styled.form`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
`


const Signup = () => {
    const [waiting,setWaiting] = useState(false);
    const [signupErrorMessage,setSignupErrorMessage] = useState(null);
    const {inputs, handleChange, handleSubmit} = useForm(signup);
    const history = useHistory();
    const match = useRouteMatch('/signup/:registrationCode')


    async function signup() {
        setWaiting(true);
        setSignupErrorMessage(null);

        authenticationService.signup({
          email: inputs.email,
          password: inputs.password,
          registration_code: match ? match.params.registrationCode : inputs.registrationCode,
          first_name: inputs.firstName,
          last_name: inputs.lastName
        })
          .then(() => {
            setWaiting(false);
            history.push('/login')
          })
          .catch(error => {setSignupErrorMessage(error)})
        
    }

    const canSignup = () => {
      if (inputs.password && inputs.email && inputs.password === inputs.confirmPass) {
        return false
      }
      return true;
    }

    return (
      <SignupBodyStyle>
        <SignupFormStyle onSubmit={handleSubmit}>
                                          
            {
                waiting 
                ? <Spinner size="300" />
                : <h3>Signup</h3> 
            }
            {
              signupErrorMessage
              ? <h3>{signupErrorMessage}</h3>
              : <></>
            }
            {
              match
              ? <TextInput disabled={true}  type="text" name="registrationCode" label="Registration Code"  value={match.params.registrationCode} placeholder="Registration Code"/>
              : <TextInput disabled={waiting}  type="text" name="registrationCode" label="Registration Code"  value={inputs.registrationCode} placeholder="Registration Code"/>
            }
          <TextInput disabled={waiting}  type="text" name="firstName" label="First Name" onChange={handleChange} value={inputs.firstName} placeholder="First Name"/>  
          <TextInput disabled={waiting}  type="text" name="lastName" label="Last Name" onChange={handleChange} value={inputs.lastName} placeholder="Last Name" />
          <TextInput disabled={waiting}  type="text" name="email" label="E-Mail" onChange={handleChange} value={inputs.email} placeholder="E-mail" required/>
          <TextInput disabled={waiting} type="password" name="password" label="Password" onChange={handleChange} value={inputs.password} placeholder="Password" required/>
          <TextInput disabled={waiting} type="password" name="confirmPass" label="Password" onChange={handleChange} value={inputs.confirmPass} placeholder="Confirm password"  required/>
          <Button onClick={handleSubmit} name="Signup" disabled={canSignup()}/>
          <input type="submit" style={{position:"absolute",left: "-9999px"}}/>
          <Link to="/login">Already have an account?</Link>
        </SignupFormStyle>
      </SignupBodyStyle>
    )
}

export {Signup}