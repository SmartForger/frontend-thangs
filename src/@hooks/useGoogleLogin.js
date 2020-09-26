import * as queryString from 'query-string'

const useGoogleLogin = ({ redirectUrl }) => {
  let securityTokenArray = new Uint32Array(3)
  window.crypto.getRandomValues(securityTokenArray)
  const securityToken = securityTokenArray.join('')
  localStorage.setItem('googleSecurityToken', securityToken)

  const stringifiedParams = queryString.stringify({
    client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_GOOGLE_OAUTH_REDIRECT_URI,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    state: encodeURIComponent(`security_token=${securityToken}&url=${redirectUrl}`),
  })

  return {
    googleLoginUrl: `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  }
}

export default useGoogleLogin
