import React from 'react'
import { Redirect } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'

const Auth = () => {
  const code = useQuery('code')
  const { error } = authenticationService.googleAuth({ code })
  if (error) return <Redirect to={'/'} />
  return <Redirect to={'/'} />
}

export default Auth
