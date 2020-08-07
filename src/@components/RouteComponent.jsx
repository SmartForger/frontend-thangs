import React from 'react'
import { Redirect } from 'react-router-dom'
import { authenticationService } from '@services'
import { history } from '../history'

const DEBUG = process.env.REACT_APP_DEBUG

const routeRequiresAnon = (Component, redirectDest = '/') => {
  const AnonymousRouteComponent = (...props) => {
    const isAuthed = authenticationService.getCurrentUserId() !== undefined
    const currentPath = history.location.pathname
    const shouldRedirect = isAuthed && currentPath !== redirectDest
    DEBUG &&
      console.debug(
        `Route requires anonymous user, should redirect to ${redirectDest}? ${shouldRedirect}`
      )
    return shouldRedirect ? <Redirect to={redirectDest} /> : <Component {...props} />
  }

  return AnonymousRouteComponent
}

const routeRequiresAuth = (Component, redirectDest = '/login') => {
  const AuthRouteComponent = (...props) => {
    const isAuthed = authenticationService.getCurrentUserId() !== undefined
    const currentPath = history.location.pathname
    const shouldRedirect = !isAuthed && currentPath !== redirectDest
    DEBUG &&
      console.debug(
        `Route requires authenticated user, should redirect to ${redirectDest}? ${shouldRedirect}`
      )
    return shouldRedirect ? <Redirect to={redirectDest} /> : <Component {...props} />
  }

  return AuthRouteComponent
}

export { routeRequiresAnon, routeRequiresAuth }
