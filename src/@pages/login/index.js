// Login Page Template
import React, {useState} from 'react';
import {useHistory } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

import {history} from '@helpers';
import {authenticationService} from '@services';
import {useForm} from '@customHooks';
import {TextInput, Spinner} from '@widgets';



const LoginBodyStyle = styled.div`
  position: fixed;
  width: 85vw;
  height: 98vh;
  left: 50%;
  top: 10%;
  margin-left:-42.5vw;
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

    const LoginError = (response) => {
        if(response.data && !response.data.successfulLogin) {
            setWaiting(false);
            setLogginErrorMessage(response.data.message);
        }

        if(response.data.successfulLogin){
            history.push("/");
        }
    }

  

    return (
      <LoginBodyStyle>
        <LoginFormStyle onSubmit={handleSubmit}>
            <h3>Welcome Back</h3>                               
            {
                waiting && !loginErrorMessage ?
                    <div>
                        <Spinner size="300" />
                    </div> : null
            }
          <TextInput disabled={waiting}  type="text" name="email" label="E-Mail" onChange={handleChange} value={inputs.email} required/>
          <TextInput disabled={waiting} type="password" name="password" label="Password" onChange={handleChange} value={inputs.password}  required/>
          <button type="submit"> Login</button>            
        </LoginFormStyle>
      </LoginBodyStyle>
    )
}

export {Login}