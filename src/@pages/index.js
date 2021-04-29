import { lazy } from 'react'
// export { default as AboutUs } from './AboutUs'
// export { default as Auth } from './Auth'
// export { default as Landing } from './Landing'
// export { default as ModelDetail } from './Model'
// export { default as MyThangs } from './MyThangs'
export * from './PasswordReset'
// export { default as Profile } from './Profile'
// export { default as PrivacyPolicy } from './PrivacyPolicy'
// export { default as RedirectModel } from './RedirectModel'
// export { default as RedirectProfile } from './RedirectProfile'
// export { default as SearchResults } from './SearchResults'
// export { default as TermsAndConditions } from './TermsAndConditions'
export * from './404'

export const AboutUs = lazy(() => import('./AboutUs'))
export const Auth = lazy(() => import('./Auth'))
export const Landing = lazy(() => import('./Landing'))
export const ModelDetail = lazy(() => import('./Model'))
export const MyThangs = lazy(() => import('./MyThangs'))
export const Profile = lazy(() => import('./Profile'))
export const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'))
export const RedirectModel = lazy(() => import('./RedirectModel'))
export const RedirectProfile = lazy(() => import('./RedirectProfile'))
export const SearchResults = lazy(() => import('./SearchResults'))
export const TermsAndConditions = lazy(() => import('./TermsAndConditions'))
