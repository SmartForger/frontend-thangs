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
    localStorage.setItem('routeBeforeSignIn', currentPath)
    const shouldRedirect = !isAuthed && currentPath !== redirectDest
    DEBUG &&
      console.debug(
        `Route requires authenticated user, should redirect to ${redirectDest}? ${shouldRedirect}`
      )
    return shouldRedirect ? <Redirect to={redirectDest} /> : <Component {...props} />
  }

  return AuthRouteComponent
}

const routeRequiresKick = Component => {
  const RouteComponent = (...props) => {
    return <Component {...props} />
  }

  return RouteComponent
}

const routeRedirectToProfile = Component => {
  const RouteComponent = (...props) => {
    const currentUserId = authenticationService.getCurrentUserId()
    const isAuthed = currentUserId !== undefined
    if (!isAuthed) return <Redirect to={'/'} />
    return <Redirect to={`/profile/${currentUserId}`} />
  }

  return RouteComponent
}

export { routeRequiresAnon, routeRequiresAuth, routeRedirectToProfile, routeRequiresKick }
