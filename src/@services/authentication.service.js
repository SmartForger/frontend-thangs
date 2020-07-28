import * as R from 'ramda'
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import { getGraphQLUrl } from './graphql-service'
import * as pendo from '@vendors/pendo'
import * as fullStory from '@vendors/full-story'

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
  const requestOptions = {
    url: getApiUrl('login'),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ email, password }),
  }

  try {
    const response = await axios(requestOptions)
    const { refresh, access } = response.data

    localStorage.setItem('refreshToken', refresh)
    localStorage.setItem('accessToken', access)

    const decoded = jwtDecode(refresh)
    const user = {
      id: `${decoded['user_id']}`,
      username: decoded.username,
      email: decoded.email,
      accessToken: access,
      refreshToken: refresh,
    }
    setCurrentUser(user)

    pendo.identify(user)
    fullStory.identify(user)

    return response
  } catch (err) {
    if (err.response) {
      return err.response
    }
    return {
      status: 500,
      data: {
        detail: 'Internal Server Error, please try again',
      },
    }
  }
}

const restLogin = async ({ password }) => {
  const username = currentUser.username
  const requestOptions = {
    url: 'https://staging-api-platform-dot-thangs.uc.r.appspot.com/auth',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ userName: username, password }),
  }

  try {
    const response = await axios(requestOptions)
    const { token } = response.data
    localStorage.setItem('restAccessToken', token.TOKEN)

    return response
  } catch (err) {
    if (err.response) {
      return err.response
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
  registration_code,
  first_name,
  last_name,
  username,
}) => {
  const requestOptions = {
    url: getApiUrl('users'),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({
      email,
      password,
      registration_code,
      first_name,
      last_name,
      username,
    }),
  }

  try {
    const data = await axios(requestOptions)
    return data
  } catch (err) {
    return err.response
  }
}

const logout = () => {
  clearCurrentUser()

  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
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

function getRestBaseUrl() {
  let url = process.env.REACT_APP_REST_API_KEY
  return withEndSlash(url)
}

function isGraphQLUrl(url) {
  const graphqlUrl = getGraphQLUrl()
  return url.includes(graphqlUrl)
}

function getApiUrl(path) {
  const baseUrl = getBaseUrl()
  const apiPath = withEndSlash(path)
  return new URL(apiPath, baseUrl)
}

export function getRestApiUrl(path) {
  const baseUrl = getRestBaseUrl()
  const apiPath = withEndSlash(path)
  return new URL(apiPath, baseUrl)
}

// This singleton Promise acts as a mutex to ensure we only have one refresh
// token request in-flight at any given time.
let refreshingAccessToken = null
const refreshAccessToken = async () => {
  if (!refreshingAccessToken) {
    refreshingAccessToken = _refreshToken()
  }
  return await refreshingAccessToken
}

const is500 = R.test(/^5../)
const is400 = R.test(/^4../)

function isErrorResponse(response) {
  return is500(response.status) || is400(response.status)
}
const _refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')

  const url = getApiUrl('token/refresh/')

  const response = await axios.post(url, { refresh: refreshToken })

  // Reset singleton so that we can enable future refreshes
  refreshingAccessToken = null

  if (isErrorResponse(response)) {
    const error = new Error()
    error.message = `Received ${response.status} when trying to refresh access token`
    throw error
  }

  const { access, refresh } = response.data

  const user = getCurrentUser()
  setCurrentUser({ ...user, accessToken: access })

  localStorage.setItem('refreshToken', refresh)
  localStorage.setItem('accessToken', access)

  return response
}

const resetPasswordForEmail = async email => {
  const url = getApiUrl('password_reset/')
  return axios.post(url, { email })
}

const setPasswordForReset = async ({ token, userId, password, confirmPassword }) => {
  const url = getApiUrl('password_reset_confirm/')
  return axios.post(url, {
    token,
    uidb64: userId,
    password,
    confirm_password: confirmPassword,
  })
}

const authenticationService = {
  login,
  restLogin,
  logout,
  signup,
  getGraphQLUrl,
  isGraphQLUrl,
  refreshAccessToken,
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

export { authenticationService }
