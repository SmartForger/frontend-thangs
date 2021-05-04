import React, { Suspense } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { history } from './history'
import {
  AboutUs,
  Auth,
  ConfirmPasswordReset,
  Landing,
  ModelDetail,
  MyThangs,
  Page404,
  PasswordReset,
  PrivacyPolicy,
  Profile,
  RedirectModel,
  RedirectProfile,
  SearchResults,
  TermsAndConditions,
} from '@pages'
import { ErrorBoundary } from './ErrorBoundary'
import { ActionMenuProvider } from '@contexts/ActionMenuProvider'
import AppAnalytics from '@components/AppAnalytics'
import { OverlayProvider } from '@contexts/OverlayProvider'
import { routeRequiresAuth, routeRedirectToProfile } from '@components/RouteComponent'
import { StoreContext } from 'storeon/react'
import { ThemeProvider, GlobalStyles } from '@physna/voxel-ui/@style'
import store from 'store'
import ScrollToTop from './@utilities/scrollToTop'

export function AppFrame() {
  return (
    <Router history={history}>
      <App />
    </Router>
  )
}

const App = () => {
  return (
    <StoreContext.Provider value={store}>
      <ErrorBoundary>
        <ThemeProvider>
          <GlobalStyles />
          <AppAnalytics />
          <ScrollToTop />
          <ActionMenuProvider>
            <OverlayProvider>
              <Suspense>
                <Switch>
                  <Route exact path='/' render={props => <Landing {...props} />} />
                  <Route
                    path='/authenticate/:provider'
                    render={props => <Auth {...props} />}
                  />
                  <Route path='/explore/:id' component={Landing} />
                  <Route
                    path='/welcome'
                    render={props => <Landing {...props} newSignUp={true} />}
                  />
                  <Route
                    path='/terms-and-conditions'
                    exact
                    component={TermsAndConditions}
                  />
                  <Route path='/privacy-policy' exact component={PrivacyPolicy} />
                  <Route path='/about-us' exact component={AboutUs} />
                  <Route path='/home' component={routeRedirectToProfile()} />
                  <Route exact path='/password-reset' component={PasswordReset} />
                  <Route
                    path='/password_reset_confirm/:token'
                    component={ConfirmPasswordReset}
                  />
                  <Route path='/mythangs' component={routeRequiresAuth(MyThangs)} />
                  <Route
                    path={['/search/:searchQuery', '/search']}
                    component={SearchResults}
                  />
                  <Route path='/profile/:id' component={RedirectProfile} />
                  <Route path='/u/:id' component={RedirectProfile} />
                  <Route path='/model/:modelId' component={RedirectModel} />
                  <Route path='/models/:modelId' component={RedirectModel} />
                  <Route path='/m/:modelId' component={RedirectModel} />
                  <Route
                    path='/:userName/:modelString'
                    render={props => <ModelDetail {...props} />}
                  />
                  <Route path='/:userName' component={Profile} />
                  <Route path='/404' component={Page404} status={404} />
                  <Route path='*' component={Page404} status={404} />
                </Switch>
              </Suspense>
            </OverlayProvider>
          </ActionMenuProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </StoreContext.Provider>
  )
}

export default AppFrame
