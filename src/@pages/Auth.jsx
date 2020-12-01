import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'
import * as queryString from 'query-string'
import { track } from '@utilities/analytics'

const Auth = ({ isLoadingOptimizely }) => {
  const code = useQuery('code')
  const state = useQuery('state')
  const { security_token: returnedSecurityToken, url } = queryString.parse(
    decodeURIComponent(state)
  )
  const { provider } = useParams()
  const googleSecurityToken = window.localStorage.getItem('googleSecurityToken')
  const facebookSecurityToken = window.localStorage.getItem('facebookSecurityToken')
  let securityToken
  if (provider === 'google')
    securityToken = googleSecurityToken ? googleSecurityToken.toString() : ''
  if (provider === 'facebook')
    securityToken = facebookSecurityToken ? facebookSecurityToken.toString() : ''

  useEffect(() => {
    const auth = async () => {
      if (returnedSecurityToken !== securityToken)
        return (window.location.href = '/?authFailed=true')
      const { data, error } = await authenticationService.ssoAuth({ code, provider })
      window.localStorage.removeItem('googleSecurityToken')
      window.localStorage.removeItem('facebookSecurityToken')

      if (error) {
        track('Third Party Signup - Failed', { source: provider.toUpperCase() })
        return (window.location.href = '/?authFailed=true')
      }
      if (data && data.token && data.token.newUser) {
        track('Third Party Signup - Success', { source: provider.toUpperCase() })
        return (window.location.href = '/welcome')
      } else {
        track('Third Party Login', { source: provider.toUpperCase() })
        if (url.includes('sessionExpired')) return (window.location.href = '/')
        return (window.location.href = url ? url : '/')
      }
    }
    if (!isLoadingOptimizely) auth()
  }, [code, provider, securityToken, returnedSecurityToken, url, isLoadingOptimizely])

  return null
}

export default Auth
