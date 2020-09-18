import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import * as pendo from '@vendors/pendo'
import ReactGA from 'react-ga'
import ReactPixel from 'react-facebook-pixel'
import { usePageMeta, useQuery } from '@hooks'

const AppAnalytics = ({ user }) => {
  const location = useLocation()
  const inviteCode = useQuery('inviteCode')
  const userIdentified = useRef(false)
  const pendoInitialized = useRef(false)
  const { title, description } = usePageMeta('App')

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID)
    if (!pendoInitialized.current) {
      pendo.initialize()
      pendoInitialized.current = true
    }
    if (user && !userIdentified.current) {
      pendo.identify(user, { inviteCode })
      userIdentified.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search)
    ReactPixel.pageView()
  }, [location])

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  )
}

export default AppAnalytics
