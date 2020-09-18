import React from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'
import * as pendo from '@vendors/pendo'

const Auth = () => {
  const code = useQuery('code')
  const { error } = authenticationService.googleAuth({ code })
  if (error) {
    pendo.track('Third Party Signup - Failed', { source: 'Google' })
    return <Redirect to={'/?authFailed=true'} />
  }
  pendo.track('Third Party Signup - Success', { source: 'Google' })
  return (window.location.href = '/')
}

export default Auth
