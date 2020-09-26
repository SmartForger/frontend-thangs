import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'
import * as queryString from 'query-string'
import * as pendo from '@vendors/pendo'

const Auth = () => {
  const code = useQuery('code')
  const state = useQuery('state')
  const { security_token: returnedSecurityToken, url } = queryString.parse(
    decodeURIComponent(state)
  )
  const { provider } = useParams()
  const googleSecurityToken = window.localStorage.getItem('googleSecurityToken')
  const facebookSecurityToken = window.localStorage.getItem('facebookSecurityToken')
  window.localStorage.removeItem('googleSecurityToken')
  window.localStorage.removeItem('facebookSecurityToken')
  let securityToken
  if (provider === 'google') securityToken = googleSecurityToken.toString()
  if (provider === 'facebook') securityToken = facebookSecurityToken.toString()

  useEffect(() => {
    const auth = async () => {
      if (returnedSecurityToken !== securityToken)
        return (window.location.href = '/?authFailed=true')
      const { data, error } = await authenticationService.ssoAuth({ code, provider })
      if (error) {
        pendo.track('Third Party Signup - Failed', { source: provider.toUpperCase() })
        return (window.location.href = '/?authFailed=true')
      }
      if (data && data.token && data.token.newUser) {
        pendo.track('Third Party Signup - Success', { source: provider.toUpperCase() })
        return (window.location.href = '/welcome')
      } else {
        pendo.track('Third Party Login', { source: provider.toUpperCase() })
        return (window.location.href = url ? url : '/')
      }
    }
    auth()
  }, [code, provider, securityToken, returnedSecurityToken, url])

  return null
}

export default Auth
