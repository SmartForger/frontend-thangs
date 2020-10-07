import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { history } from './history'
import {
  AboutUs,
  Auth,
  ConfirmPasswordReset,
  Landing,
  Login,
  ModelDetail,
  MyThangs,
  Page404,
  PasswordReset,
  PrivacyPolicy,
  Profile,
  RedirectProfile,
  SearchResults,
  Signup,
  TermsAndConditions,
  FolderPage,
} from '@pages'
import { ErrorBoundary } from './ErrorBoundary'
import { AppAnalytics } from '@components'
import {
  routeRequiresAnon,
  routeRequiresAuth,
  routeRequiresKick,
  routeRedirectToProfile,
} from '@components/RouteComponent'
import { FlashContextProvider } from '@components/Flash'
import { StoreContext } from 'storeon/react'
import { ThemeProvider } from '@style'
import { GlobalStyles } from '@style/globals'
import store from 'store'

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
              <Route
                path='/folder/:folderId'
                exact
                component={routeRequiresAuth(FolderPage)}
              />
              <Route path='/login' component={routeRequiresAnon(Login)} />
              <Route path='/terms_and_conditions' exact component={TermsAndConditions} />
              <Route path='/privacy_policy' exact component={PrivacyPolicy} />
              <Route path='/about-us' exact component={AboutUs} />
              <Route path='/home' component={routeRedirectToProfile()} />
              <Route
                path='/signup/:registrationCode'
                component={routeRequiresAnon(Signup)}
                exact
              />
              <Route exact path='/password_reset' component={PasswordReset} />
              <Route
                path='/password_reset_confirm/:token'
                component={ConfirmPasswordReset}
              />
              <Route exact path='/thangs' component={MyThangs} />
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
