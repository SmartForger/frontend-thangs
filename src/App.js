import React, { useState } from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import { history } from './history'
import { createInstance, OptimizelyProvider } from '@optimizely/react-sdk'
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
import { ActionMenuProvider, AppAnalytics, OverlayProvider } from '@components'
import {
  routeRequiresAuth,
  routeRequiresKick,
  routeRedirectToProfile,
} from '@components/RouteComponent'
import { FlashContextProvider } from '@components/Flash'
import { StoreContext } from 'storeon/react'
import { useLocalStorage } from '@hooks'
import { ThemeProvider } from '@style'
import { GlobalStyles } from '@style/globals'
import store from 'store'
import { authenticationService } from '@services'
import ScrollToTop from './@utilities/scrollToTop'

export function AppFrame() {
  return (
    <Router history={history}>
      <App />
    </Router>
  )
}

const App = () => {
  const [isLoadingOptimizely, setIsLoadingOptimizely] = useState(true)
  // const { ActionBar, isActionBarOpen, isActionBarHidden } = useActionBar()
  const user = authenticationService.getCurrentUser()
  const [experimentationId, setExpId] = useLocalStorage('experimentationId', null)
  if (!experimentationId) setExpId(Math.random().toString(36).substring(2, 15))
  const optimizely = createInstance({
    sdkKey: process.env.REACT_APP_OPTIMIZELY_API_KEY,
  })

  optimizely.onReady({ timeout: 5000 }).then(() => {
    setIsLoadingOptimizely(false)
  })

  return (
    <OptimizelyProvider
      optimizely={optimizely}
      timeout={500}
      user={{ id: (user || { id: experimentationId }).id }}
    >
      <StoreContext.Provider value={store}>
        <ErrorBoundary>
          <FlashContextProvider>
            <ThemeProvider>
              <GlobalStyles />
              <AppAnalytics />
              <ScrollToTop />
              <OverlayProvider>
                <ActionMenuProvider>
                  <Switch>
                    <Route
                      exact
                      path='/'
                      render={props => (
                        <Landing isLoadingOptimizely={isLoadingOptimizely} {...props} />
                      )}
                    />
                    <Route
                      path='/authenticate/:provider'
                      render={props => (
                        <Auth isLoadingOptimizely={isLoadingOptimizely} {...props} />
                      )}
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
                    <Route exact path='/profile/:id' component={Profile} />
                    <Route
                      exact
                      path='/profile/'
                      component={routeRequiresAuth(RedirectProfile)}
                    />
                    <Route
                      path='/model/:id'
                      exact
                      component={routeRequiresKick(ModelDetail)}
                    />
                    <Route
                      path={['/search/:searchQuery', '/search']}
                      component={SearchResults}
                    />
                    <Route path='/:userName' component={Profile} />
                    <Route path='/404' component={Page404} status={404} />
                    <Route path='*' component={Page404} status={404} />
                  </Switch>
                </ActionMenuProvider>
              </OverlayProvider>
            </ThemeProvider>
          </FlashContextProvider>
        </ErrorBoundary>
      </StoreContext.Provider>
    </OptimizelyProvider>
  )
}

export default AppFrame
