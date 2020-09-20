import React, { useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'
import * as pendo from '@vendors/pendo'

const Auth = () => {
  const code = useQuery('code')
  useEffect(() => {
    const googleAuth = async () => {
      const { error } = await authenticationService.googleAuth({ code })
      if (error) {
        pendo.track('Third Party Signup - Failed', { source: 'Google' })
        return <Redirect to={'/?authFailed=true'} />
      }
      pendo.track('Third Party Signup - Success', { source: 'Google' })
      return (window.location.href = '/welcome')
    }
    googleAuth()
  }, [code])

  return null
}

export default Auth
