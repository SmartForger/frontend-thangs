import React, { useMemo } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { useQuery } from '@hooks'
import { authenticationService } from '@services'

const Auth = () => {
  const location = useLocation()
  const query = useQuery(location)
  const code = useMemo(() => query.get('code'), [query])

  const { error } = authenticationService.googleAuth({ code })
  if (error) return <Redirect to={'/'} />
  return <Redirect to={'/'} />
}

export default Auth
