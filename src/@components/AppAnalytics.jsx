import React, { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useStoreon } from 'storeon/react'
import { authenticationService } from '@services'
import {
  initialize,
  identify,
  locationChange,
  updateUserExperiments,
} from '@utilities/analytics'
import ReactGA from 'react-ga'
import ReactPixel from 'react-facebook-pixel'
import usePageMeta from '@hooks/usePageMeta'
import useQuery from '@hooks/useQuery'
import * as types from '@constants/storeEventTypes'

const AppAnalytics = () => {
  const location = useLocation()
  const inviteCode = useQuery('inviteCode')
  const userIdentified = useRef(false)
  const analyticsInitialized = useRef(false)
  const { title, description } = usePageMeta('App')
  const user = authenticationService.getCurrentUser()
  const { dispatch, experiments } = useStoreon('experiments')

  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)
    ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID)
    if (!analyticsInitialized.current) {
      initialize()
      analyticsInitialized.current = true
    }
    if (user && !userIdentified.current) {
      identify({ user, inviteCode, experiments: {} })
      userIdentified.current = true
    }

    dispatch(types.FETCH_EXPERIMENTS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    if (experiments?.data) updateUserExperiments(experiments?.data)
  }, [experiments])

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search)
    ReactPixel.pageView()
  }, [location])

  useEffect(() => {
    locationChange()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  )
}

export default AppAnalytics
