import React, { useEffect } from 'react'
import { Redirect, useParams } from 'react-router-dom'
import { useStoreon } from 'storeon/react'
import * as types from '@constants/storeEventTypes'

const RedirectProfile = () => {
  const { id } = useParams()
  const { dispatch, [`user-${id}`]: userData = {} } = useStoreon(`user-${id}`)
  const { isError, data: user } = userData

  useEffect(() => {
    dispatch(types.FETCH_USER, { id })
  }, [dispatch, id])

  if (isError) return <Redirect to={'/'} />
  if (user && user.username) return <Redirect to={`/${user.username}`} />
  return null
}

export default RedirectProfile
