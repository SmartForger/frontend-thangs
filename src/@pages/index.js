import { lazy } from 'react'

export * from './PasswordReset'
export * from './404'

export const AboutUs = lazy(() => import(/* webpackChunkName: 'about' */ './AboutUs'))
export const Auth = lazy(() => import(/* webpackChunkName: 'auth' */ './Auth'))
export const Landing = lazy(() => import(/* webpackChunkName: 'home' */ './Landing'))
export const ModelDetail = lazy(() => import(/* webpackChunkName: 'model' */ './Model'))
export const MyThangs = lazy(() =>
  import(/* webpackChunkName: 'my-thangs' */ './MyThangs')
)
export const Profile = lazy(() => import(/* webpackChunkName: 'profile' */ './Profile'))
export const PrivacyPolicy = lazy(() =>
  import(/* webpackChunkName: 'privacy' */ './PrivacyPolicy')
)
export const RedirectModel = lazy(() =>
  import(/* webpackChunkName: 'redirect' */ './RedirectModel')
)
export const RedirectProfile = lazy(() =>
  import(/* webpackChunkName: 'redirect' */ './RedirectProfile')
)
export const SearchResults = lazy(() =>
  import(/* webpackChunkName: 'search' */ './SearchResults')
)
export const TermsAndConditions = lazy(() =>
  import(/* webpackChunkName: 'toc' */ './TermsAndConditions')
)
