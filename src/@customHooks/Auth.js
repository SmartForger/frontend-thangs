import React, { useEffect, useContext, createContext, useState} from 'react'
import {useLocalStorage} from './Storage';
import {PhysnaServer} from '@utilities';



const AuthContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

const useAuth = () => {
    return useContext(AuthContext);
}

function useProvideAuth() {
    const [user,setUser, clearUser] = useLocalStorage('user', null);
    const [authenticated, setAuthenticated] = useState(false);

    

    // Wrap auth methods we want to use, making sure to save the state
    const login = async (email, password, options) => {

        options = options || {};
        let rememberMe = options.rememberMe || false;
        let socialMediaLogin = options.socialMediaLogin || 'none';
        let socialMediaPlatform = options.socialMediaPlatform || 'none';
        let AvatarUrl = options.AvatarUrl || 'https://00000.0000';
        let Name = options.Name || 'noname';
        let errorCallback = options.errorCallback || null;

        let reqData = `Email=${email}&Password=${password}&RememberMe=${rememberMe}&SocialMediaLogin=${socialMediaLogin}&Avatar=${encodeURI(AvatarUrl)}&socialMediaPlatform=${socialMediaPlatform}&Name=${Name}`

        
        let response = await PhysnaServer({
            method: 'post',
            url:`/auth/login`,
            data: reqData
        });

        if (response.data.successfulLogin) {
            //const returnUrl = window.location.search.replace(/^.*?/, '');
            setUser(response.data.user);

            //Old physna Auth logic for the time being
            window.PhysnaAuth.ClearSocialMediaResponse();
            window.PhysnaAuth.PhysnaUser = response.data.user
            

            return response;
        } else {
            errorCallback && errorCallback(response);
            return response;
        }
    }


    const getCurrentUser = async () => {
        if(!user) {
            const userReq = await PhysnaServer({
                method: 'GET',
                url: '/users/currentuser'
            })

            try {
                setUser(userReq.data.response.user);
                setAuthenticated(true);
            } catch (error) {
                console.log('User is not Logged in')
            }
        }
    }

    const ensureAuth = (response) => {
        if(response.data) {
            setAuthenticated(response.data.response.user.id && response.data.response.user.id !== "none")
            setUser(response.data.response.user)
        } else {
            setAuthenticated(response)
        }
    }

    const signup = async (signupData) => {
        await PhysnaServer({
            method: 'post',
            url: `/Account/RegisterAccount/`,
            data: signupData
          })
    }

    const logout = async () => {
        await PhysnaServer({
            method: 'post',
            url: `/auth/logout`,
        });
       clearUser();
       ensureAuth(false);
    }

    const sendPasswordResetEmail = (email) => {
        /*
            send email and return success 
        */
    }

    const confirmPasswordReset = (code, password) => {
        /*
            reset password and return success 
        */
    }
    
    //Subscribe to the user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    useEffect(() => {
        getCurrentUser();
    });


    // the useProviderAuth returns an object containing these keys
    return {
        // Auth Variables
        user,
        authenticated,
        // Auth Functions
        getCurrentUser,
        ensureAuth,
        login,
        signup,
        logout,
        sendPasswordResetEmail,
        confirmPasswordReset,
    };
}

export {ProvideAuth, useAuth};