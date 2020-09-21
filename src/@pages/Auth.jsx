import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'
import * as pendo from '@vendors/pendo'

const Auth = () => {
  const code = useQuery('code')
  useEffect(() => {
    const googleAuth = async () => {
      const { data, error } = await authenticationService.googleAuth({ code })
      if (error) {
        pendo.track('Third Party Signup - Failed', { source: 'Google' })
        return <Redirect to={'/?authFailed=true'} />
      }
      if (data && data.token && data.token.newUser) {
        pendo.track('Third Party Signup - Success', { source: 'Google' })
        return (window.location.href = '/welcome')
      } else {
        pendo.track('Third Party Login', { source: 'Google' })
        return (window.location.href = '/')
      }
    }
    googleAuth()
  }, [code])

  return null
}

export default Auth
