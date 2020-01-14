import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import styled from 'styled-components';
import {authenticationService} from '@services';
import {useForm} from '@customHooks';
import {TextInput, Spinner, Button} from '@components';



const LoginBodyStyle = styled.div`
  position: fixed;
  width: ${props => props.theme.pageWidth};
  height: ${props => props.theme.pageHeight};
  top: ${props => props.theme.pageTop};
  left: ${props => props.theme.pageLeft};
  margin-left: ${props => props.theme.pageMarginLeft};
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const LoginFormStyle = styled.form`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
`


const Login = () => {
    const [waiting,setWaiting] = useState(false);
    const [loginErrorMessage,setLogginErrorMessage] = useState(null);
    const {inputs, handleChange, handleSubmit} = useForm(login);
    const history = useHistory();


    async function login() {
        setWaiting(true);
        setLogginErrorMessage(null);

        authenticationService.login({
          email: inputs.email,
          password: inputs.password
        })
          .then(() => {
            setWaiting(false);
            history.push('/')
          })
        
    }

    return (
      <LoginBodyStyle>
        <LoginFormStyle onSubmit={handleSubmit}>
                                          
            {
                waiting 
                ? <Spinner size="300" />
                : <h3>Welcome Back</h3> 
            }
          <TextInput disabled={waiting}  type="text" name="email" label="E-Mail" onChange={handleChange} value={inputs.email} required/>
          <TextInput disabled={waiting} type="password" name="password" label="Password" onChange={handleChange} value={inputs.password}  required/>
          <Button onClick={handleSubmit} name="Login"/>
          <input type="submit" style={{position:"absolute",left: "-9999px"}}/>
        </LoginFormStyle>
      </LoginBodyStyle>
    )
}

export {Login}