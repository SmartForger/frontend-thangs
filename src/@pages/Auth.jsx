import React, { useEffect, useParams } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'
import * as pendo from '@vendors/pendo'

const Auth = () => {
  const code = useQuery('code')
  const { provider } = useParams()
  useEffect(() => {
    const auth = async () => {
      const { data, error } = await authenticationService.ssoAuth({ code, provider })
      if (error) {
        pendo.track('Third Party Signup - Failed', { source: provider.toUpperCase() })
        return <Redirect to={'/?authFailed=true'} />
      }
      if (data && data.token && data.token.newUser) {
        pendo.track('Third Party Signup - Success', { source: provider.toUpperCase() })
        return (window.location.href = '/welcome')
      } else {
        pendo.track('Third Party Login', { source: provider.toUpperCase() })
        return (window.location.href = '/')
      }
    }
    auth()
  }, [code, provider])

  return null
}

export default Auth
