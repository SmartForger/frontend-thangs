// Login Page Template
import React, {useState} from 'react';
import {useHistory } from 'react-router-dom';
import {useForm} from '../../customHooks'
import styled from 'styled-components';
import axios from 'axios';


const LoginBodyStyle = styled.div`
  position: fixed;
  width: 85vw;
  height: 98vh;
  left: 50%;
  top: 10%;
  margin-left:-42.5vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoginFormStyle = styled.form`
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
`


const Login = () => {
    const [waiting,setWaiting] = useState(false);
    const [loginErrorMessage,setLogginErrorMessage] = useState(null);
    const {inputs, handleChange, handleSubmit} = useForm(login);
    const history = useHistory();


    async function login() {
        setWaiting(true);
        setLogginErrorMessage(null);
        try{
          let response = await axios({
            method: 'post',
            url:`https://localhost:44338/api/v1/auth/login`,
            data: inputs
          });
  
          console.log(response);
        }
        catch(e) {
          console.log(e);
        }
        
      
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
                        <h1>LOADING ...</h1>
                    </div> : null
            }
          <input disabled={waiting}  type="text" name="email" label="E-Mail" onChange={handleChange} value={inputs.email} required/>
          <input disabled={waiting} type="password" name="password" label="Password" onChange={handleChange} value={inputs.password}  required/>
          <button type="submit"> Login</button>            
        </LoginFormStyle>
      </LoginBodyStyle>
    )
}

export {Login}