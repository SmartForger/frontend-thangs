import * as queryString from 'query-string'

const useGoogleLogin = () => {
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
  })

  return {
    googleLoginUrl: `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`,
  }
}

export default useGoogleLogin
