import axios from 'axios'

function getCurrentUserFromLocalStorage() {
  const currentUserStr = localStorage.getItem('currentUser')
  if (currentUserStr) {
    try {
      return JSON.parse(currentUserStr)
    } catch (e) {
      clearCurrentUserFromLocalStorage()
    }
  }
}

function setCurrentUserInLocalStorage(user) {
  const currentUserStr = JSON.stringify(user)
  localStorage.setItem('currentUser', currentUserStr)
}

function clearCurrentUserFromLocalStorage() {
  localStorage.removeItem('currentUser')
}

let currentUser = undefined

function getCurrentUser() {
  if (!currentUser) {
    currentUser = getCurrentUserFromLocalStorage()
  }
  return currentUser
}

function setCurrentUser(user) {
  setCurrentUserInLocalStorage(user)
  currentUser = user
}

function clearCurrentUser() {
  clearCurrentUserFromLocalStorage()
  currentUser = undefined
}

const login = async ({ email, password }) => {
  const authUrl = `${process.env.REACT_APP_API_KEY}auth`
  const requestOptions = {
    url: authUrl,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ userName: email, password }),
  }

  try {
    const response = await axios(requestOptions)
    const { token } = response.data
    const { TOKEN: accessToken, expires: tokenExpiration, user } = token
    localStorage.setItem('accessToken', accessToken)

    const newUser = {
      ...user,
      accessToken: accessToken,
      accessTokenExpiration: tokenExpiration,
    }
    setCurrentUser(newUser)

    return response
  } catch (err) {
    if (err.response) {
      return { error: err.response }
    }
    return {
      status: 500,
      data: {
        detail: 'Internal Server Error, please try again',
      },
    }
  }
}

const signup = async ({
  email,
  password,
  registrationCode = 'alpha',
  firstName,
  lastName,
  username,
}) => {
  const requestOptions = {
    url: getApiUrl('users'),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      email,
      password,
      registrationCode,
      firstName,
      lastName,
      username,
    }),
  }
  try {
    return await axios(requestOptions)
  } catch (err) {
    if (err.response) {
      return { error: err.response.data }
    }
    return {
      status: 500,
      data: {
        detail: 'Internal Server Error, please try again',
      },
    }
  }
}

const ssoAuth = async ({ code, provider }) => {
  if (provider === 'google') {
    return googleAuth({ code })
  } else if (provider === 'facebook') {
    return facebookAuth({ code })
  }
  return { error: 'Provider not found' }
}

const facebookAuth = async ({ code }) => {
  const authUrl = `${process.env.REACT_APP_API_KEY}auth/facebook`
  const requestOptions = {
    url: authUrl,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ code }),
  }

  try {
    const response = await axios(requestOptions)
    const { token } = response.data
    const { TOKEN: accessToken, expires: tokenExpiration, user } = token
    localStorage.setItem('accessToken', accessToken)

    const newUser = {
      ...user,
      accessToken: accessToken,
      accessTokenExpiration: tokenExpiration,
    }
    setCurrentUser(newUser)

    return response
  } catch (err) {
    if (err.response) {
      return { error: err.response }
    }
    return {
      status: 500,
      data: {
        detail: 'Internal Server Error, please try again',
      },
    }
  }
}

const googleAuth = async ({ code }) => {
  const authUrl = `${process.env.REACT_APP_API_KEY}auth/google`
  const requestOptions = {
    url: authUrl,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ code }),
  }

  try {
    const response = await axios(requestOptions)
    const { token } = response.data
    const { TOKEN: accessToken, expires: tokenExpiration, user } = token
    localStorage.setItem('accessToken', accessToken)

    const newUser = {
      ...user,
      accessToken: accessToken,
      accessTokenExpiration: tokenExpiration,
    }
    setCurrentUser(newUser)

    return response
  } catch (err) {
    if (err.response) {
      return { error: err.response }
    }
    return {
      status: 500,
      data: {
        detail: 'Internal Server Error, please try again',
      },
    }
  }
}

const logout = () => {
  clearCurrentUser()
  localStorage.clear()
}

const hasEndSlash = /\/$/

function withEndSlash(path) {
  if (hasEndSlash.test(path)) {
    return path
  }
  return `${path}/`
}

function getBaseUrl() {
  let url = process.env.REACT_APP_API_KEY
  return withEndSlash(url)
}

export function getApiUrl(path) {
  const baseUrl = getBaseUrl()
  const apiPath = withEndSlash(path)
  return new URL(apiPath, baseUrl)
}

const resetPasswordForEmail = async email => {
  const url = getApiUrl('auth/password-reset/')
  return axios.post(url, { email })
}

const setPasswordForReset = async ({ token, password, confirmPassword }) => {
  const url = getApiUrl('auth/password-reset-confirm/')
  return axios.post(url, {
    token,
    password,
    confirmPassword,
  })
}

const authenticationService = {
  login,
  logout,
  signup,
  ssoAuth,
  resetPasswordForEmail,
  setPasswordForReset,
  getCurrentUser,
  getCurrentUserId() {
    const currentUser = getCurrentUser()
    if (currentUser) {
      return currentUser.id
    }
  },
}

export default authenticationService
