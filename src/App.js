import React from 'react'
import { ApolloProvider } from '@apollo/react-hooks'
import { Route, Router, Switch, useLocation } from 'react-router-dom'
import { storeonDevtools } from 'storeon/devtools'

import * as pendo from '@vendors/pendo'
import * as fullStory from '@vendors/full-story'
import { authenticationService, graphqlClient } from '@services'
import { history } from './history'
import {
  Landing,
  Login,
  Signup,
  PasswordReset,
  ConfirmPasswordReset,
  SearchResults,
  Page404,
  Profile,
  Likes,
  EditProfile,
  RedirectProfile,
  Newspost,
  ModelDetail,
  TermsAndConditions,
  Home,
} from '@pages'
import { Upload } from '@pages/Upload'
import { UploadVersion } from '@pages/UploadVersion'
import { Matching } from '@pages/Matching'
import { FolderPage } from '@pages/Folder'
import { ModelPreview } from '@pages/ModelPreview'
import { Notifications } from '@pages/Notifications'
import { FolderUpload } from '@pages/FolderUpload'
import { ErrorBoundary } from './ErrorBoundary'
import { routeRequiresAnon, routeRequiresAuth } from '@components/RouteComponent'
import { FlashContextProvider } from './@components/Flash'
import { StoreContext } from 'storeon/react'
import { ThemeProvider } from '@style'
import { GlobalStyles } from '@style/globals'
import { usePageTheming } from '@hooks'
import store from 'store'

const originalFetch = window.fetch
const client = graphqlClient(originalFetch, history)

const initializeAnalytics = history => {
  const user = authenticationService.getCurrentUser()

  pendo.initialize(history)
  pendo.identify(user)

  fullStory.initialize()
  fullStory.identify(user)
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
                  path='/preview/model/:id'
                  component={routeRequiresAuth(ModelPreview)}
                />
                <Route path='/newspost/:id' component={routeRequiresAuth(Newspost)} />
                <Route
                  path={['/search/:searchQuery', '/search']}
                  component={routeRequiresAuth(SearchResults)}
                />
                <Route path='/matching' component={routeRequiresAuth(Matching)} />
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
