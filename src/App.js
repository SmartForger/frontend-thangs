import React, { useEffect } from 'react'
import { Route, Router, Switch, useHistory } from 'react-router-dom'
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
  RedirectProfile,
  SearchResults,
  TermsAndConditions,
} from '@pages'
import { ErrorBoundary } from './ErrorBoundary'
import { AppAnalytics } from '@components'
import {
  routeRequiresAuth,
  routeRequiresKick,
  routeRedirectToProfile,
} from '@components/RouteComponent'
import { FlashContextProvider } from '@components/Flash'
import { StoreContext } from 'storeon/react'
import { ThemeProvider } from '@style'
import { GlobalStyles } from '@style/globals'
import store from 'store'
import { locationChange } from '@utilities/analytics'

export function AppFrame() {
  return (
    <Router history={history}>
      <App />
    </Router>
  )
}

const App = () => {
  const history = useHistory()

  useEffect(() => {
    locationChange()
    history.listen(locationChange)
  }, [history])

  return (
    <StoreContext.Provider value={store}>
      <ErrorBoundary>
        <FlashContextProvider>
          <ThemeProvider>
            <GlobalStyles />
            <AppAnalytics />
            <Switch>
              <Route exact path='/' render={props => <Landing {...props} />} />
              <Route path='/authenticate/:provider' component={Auth} />
              {/* <Route path='/leave/:provider' component={Deauth} />
              <Route path='/delete/:provider' component={Deauth} /> */}
              <Route path='/explore/:id' component={Landing} />
              <Route
                path='/welcome'
                render={props => <Landing {...props} newSignUp={true} />}
              />
              <Route path='/terms-and-conditions' exact component={TermsAndConditions} />
              <Route path='/privacy-policy' exact component={PrivacyPolicy} />
              <Route path='/about-us' exact component={AboutUs} />
              <Route path='/home' component={routeRedirectToProfile()} />
              <Route exact path='/password-reset' component={PasswordReset} />
              <Route
                path='/password-reset-confirm/:token'
                component={ConfirmPasswordReset}
              />
              <Route path='/mythangs' component={routeRequiresAuth(MyThangs)} />
              <Route exact path='/profile/:id' component={Profile} />
              <Route
                exact
                path='/profile/'
                component={routeRequiresAuth(RedirectProfile)}
              />
              <Route path='/model/:id' exact component={routeRequiresKick(ModelDetail)} />
              <Route
                path={['/search/:searchQuery', '/search']}
                component={SearchResults}
              />
              <Route path='/:userName' component={Profile} />
              <Route path='/404' component={Page404} status={404} />
              <Route path='*' component={Page404} status={404} />
            </Switch>
          </ThemeProvider>
        </FlashContextProvider>
      </ErrorBoundary>
    </StoreContext.Provider>
  )
}

export default AppFrame
