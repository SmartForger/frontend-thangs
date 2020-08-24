import React, { useEffect } from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { Route, Router, Switch, useLocation } from 'react-router-dom'

import * as pendo from '@vendors/pendo'
import ReactGA from 'react-ga'
import ReactPixel from 'react-facebook-pixel'

import { authenticationService, graphqlClient } from '@services'
import { history } from './history'
import {
  ConfirmPasswordReset,
  EditProfile,
  Home,
  Landing,
  Likes,
  Login,
  ModelDetail,
  Page404,
  PasswordReset,
  PrivacyPolicy,
  Profile,
  RedirectProfile,
  SearchResults,
  Signup,
  TermsAndConditions,
} from '@pages'
import { Upload } from '@pages/Upload'
import { UploadVersion } from '@pages/UploadVersion'
import { Matching } from '@pages/Matching'
import { FolderPage } from '@pages/Folder'
import { Notifications } from '@pages/Notifications'
import { FolderUpload } from '@pages/FolderUpload'
import { ErrorBoundary } from './ErrorBoundary'
import { routeRequiresAnon, routeRequiresAuth } from '@components/RouteComponent'
import { FlashContextProvider } from '@components/Flash'
import { StoreContext } from 'storeon/react'
import { ThemeProvider } from '@style'
import { GlobalStyles } from '@style/globals'
import { usePageTheming } from '@hooks'
import store from 'store'

const originalFetch = window.fetch
const client = graphqlClient(originalFetch, history)

const initializeAnalytics = history => {
  const user = authenticationService.getCurrentUser()

  ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)
  ReactPixel.init(process.env.REACT_APP_FACEBOOK_PIXEL_ID)
  pendo.initialize(history)
  pendo.identify(user)
}

export function AppFrame() {
  return (
    <Router history={history}>
      <App />
    </Router>
  )
}

const App = () => {
  const location = useLocation()
  initializeAnalytics(history)
  const theme = usePageTheming(location)

  useEffect(() => {
    ReactGA.pageview(location.pathname + location.search)
    ReactPixel.pageView()
  }, [location])
  return (
    <ApolloProvider client={client}>
      <StoreContext.Provider value={store}>
        <ErrorBoundary>
          <FlashContextProvider>
            <ThemeProvider theme={theme}>
              <GlobalStyles />
              <Switch>
                <Route exact path='/' component={Landing} />
                <Route
                  path='/welcome'
                  render={props => <Landing {...props} newSignUp={true} />}
                />
                <Route
                  path='/folder/:folderId/upload'
                  component={routeRequiresAuth(FolderUpload)}
                />
                <Route
                  path='/folder/:folderId'
                  exact
                  component={routeRequiresAuth(FolderPage)}
                />
                <Route path='/login' component={routeRequiresAnon(Login)} />
                <Route
                  path='/terms_and_conditions'
                  exact
                  component={TermsAndConditions}
                />
                <Route path='/privacy_policy' exact component={PrivacyPolicy} />
                <Route path='/home' component={routeRequiresAuth(Home)} />
                <Route
                  path='/signup/:registrationCode'
                  component={routeRequiresAnon(Signup)}
                  exact
                />
                <Route exact path='/password_reset' component={PasswordReset} />
                <Route
                  path='/password_reset_confirm/:userId/:token'
                  component={ConfirmPasswordReset}
                />
                <Route
                  exact
                  path='/profile/edit'
                  component={routeRequiresAuth(EditProfile)}
                />
                <Route path='/profile/likes' component={routeRequiresAuth(Likes)} />
                <Route exact path='/profile/:id' component={routeRequiresAuth(Profile)} />
                <Route
                  exact
                  path='/profile/'
                  component={routeRequiresAuth(RedirectProfile)}
                />
                <Route
                  path='/model/:id'
                  exact
                  component={routeRequiresAuth(ModelDetail)}
                />
                <Route
                  path={['/search/:searchQuery', '/search']}
                  component={SearchResults}
                />
                <Route path='/matching' component={Matching} />
                <Route path='/upload' component={routeRequiresAuth(Upload)} />
                <Route
                  path='/model/:id/upload'
                  component={routeRequiresAuth(UploadVersion)}
                />
                <Route
                  path='/notifications'
                  component={routeRequiresAuth(Notifications)}
                />
                <Route path='*' component={Page404} status={404} />
              </Switch>
            </ThemeProvider>
          </FlashContextProvider>
        </ErrorBoundary>
      </StoreContext.Provider>
    </ApolloProvider>
  )
}

export default AppFrame
