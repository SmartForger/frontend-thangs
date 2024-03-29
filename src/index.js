import React from 'react'
import ReactDOM from 'react-dom'
// import * as Sentry from '@sentry/react'
// import { Integrations } from '@sentry/tracing'
import App from './App'
import * as serviceWorker from './serviceWorker'
import TagManager from 'react-gtm-module'
import { getWorker } from './@services/worker'
import windowLoad from '@utilities/windowLoad'
import { loadSignin } from '@overlays'

windowLoad.then(() => {
  // Preload 'overlays' bundle
  loadSignin()

  // Load GTM
  TagManager.initialize({
    gtmId: process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID,
  })
})

// if (process.env.REACT_APP_SENTRY_ID) {
//   Sentry.init({
//     dsn: process.env.REACT_APP_SENTRY_ID,
//     autoSessionTracking: true,
//     integrations: [new Integrations.BrowserTracing()],

//     // We recommend adjusting this value in production, or using tracesSampler
//     // for finer control
//     tracesSampleRate: 0.1,
//   })
// }

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

getWorker()
