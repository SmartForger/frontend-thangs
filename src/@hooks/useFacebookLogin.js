import * as queryString from 'query-string'

const useFacebookLogin = ({ redirectUrl }) => {
  let securityTokenArray = new Uint32Array(3)
  window.crypto.getRandomValues(securityTokenArray)
  const securityToken = securityTokenArray.join('')
  localStorage.setItem('facebookSecurityToken', securityToken)
  const safeRedirectUrl =
    redirectUrl.includes('authFailed') || redirectUrl.includes('sessionExpired')
      ? `${window.location.origin}${window.location.pathname}`
      : redirectUrl

  const stringifiedParams = queryString.stringify({
    client_id: process.env.REACT_APP_FACEBOOK_OAUTH_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_FACEBOOK_OAUTH_REDIRECT_URI,
    scope: ['email'].join(','),
    response_type: 'code',
    auth_type: 'rerequest',
    display: 'popup',
    state: encodeURIComponent(`security_token=${securityToken}&url=${safeRedirectUrl}`),
  })

  return {
    facebookLoginUrl: `https://www.facebook.com/v8.0/dialog/oauth?${stringifiedParams}`,
  }
}

export default useFacebookLogin
