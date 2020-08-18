import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { logger } from '@utilities/logging'
import TagManager from 'react-gtm-module'

const tagManagerArgs = {
  gtmId: process.env.REACT_APP_GOOGLE_TAG_MANAGER_ID,
}

TagManager.initialize(tagManagerArgs)

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

logger.init({
  googleCloudApiKey: process.env.REACT_APP_GOOGLE_CLOUD_ERROR_REPORTING_KEY,
  googleCloudProjectId: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID,
  environment: process.env.NODE_ENV,
})
