import React from 'react'
import { useLocation } from 'react-router-dom'

const HideOnRoutes = ({ routes, children }) => {
  const location = useLocation()
  if (routes.includes(location.pathname.match(/[^\\/]*\/[^/]*/)[0])) {
    return <div style={{ display: 'none' }}>{children}</div>
  }

  return <div>{children}</div>
}

export default HideOnRoutes
