import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { Route, Router, Switch } from 'react-router-dom';

import * as pendo from '@vendors/pendo';
import * as fullStory from '@vendors/full-story';
import { authenticationService, graphqlClient } from '@services';
import { history } from './history';
import {
    Landing,
    Login,
    Signup,
    PasswordReset,
    ConfirmPasswordReset,
    SearchResults,
    Page404,
    Profile,
    EditProfile,
    RedirectProfile,
    Newspost,
    ModelDetail,
    TermsAndConditions,
} from '@pages';
import { Upload } from '@pages/Upload';
import { Matching } from '@pages/Matching';
import { ModelPreview } from '@pages/ModelPreview';
import { Notifications } from '@pages/Notifications';
import { ErrorBoundary } from './ErrorBoundary';
import {
    routeRequiresAnon,
    routeRequiresAuth,
} from '@components/RouteComponent';

const originalFetch = window.fetch;
const client = graphqlClient(originalFetch, history);

const initializeAnalytics = history => {
    const user = authenticationService.getCurrentUser();

    pendo.initialize(history);
    pendo.identify(user);

    fullStory.initialize();
    fullStory.identify(user);
};

export function AppFrame({ children }) {
    return <Router history={history}>{children}</Router>;
}

const App = () => {
    initializeAnalytics(history);

    return (
        <AppFrame>
            <ApolloProvider client={client}>
                <ErrorBoundary>
                    <Switch>
                        <Route
                            exact
                            path="/"
                            component={routeRequiresAuth(Landing)}
                        />
                        <Route
                            path="/login"
                            component={routeRequiresAnon(Login)}
                        />
                        <Route
                            path="/terms_and_conditions"
                            exact
                            component={TermsAndConditions}
                        />
                        <Route
                            path="/signup/:registrationCode"
                            component={routeRequiresAnon(Signup)}
                            exact
                        />
                        <Route
                            exact
                            path="/password_reset"
                            component={PasswordReset}
                        />
                        <Route
                            path="/password_reset_confirm/:userId/:token"
                            component={ConfirmPasswordReset}
                        />
                        <Route
                            exact
                            path="/profile/edit"
                            component={routeRequiresAuth(EditProfile)}
                        />
                        <Route
                            path="/profile/:id"
                            component={routeRequiresAuth(Profile)}
                        />
                        <Route
                            exact
                            path="/profile/"
                            component={routeRequiresAuth(RedirectProfile)}
                        />
                        <Route
                            path="/model/:id"
                            component={routeRequiresAuth(ModelDetail)}
                        />
                        <Route
                            path="/preview/model/:id"
                            component={routeRequiresAuth(ModelPreview)}
                        />
                        <Route
                            path="/newspost/:id"
                            component={routeRequiresAuth(Newspost)}
                        />
                        <Route
                            path="/search/:searchQuery"
                            component={routeRequiresAuth(SearchResults)}
                        />
                        <Route
                            path="/matching"
                            component={routeRequiresAuth(Matching)}
                        />
                        <Route
                            path="/upload"
                            component={routeRequiresAuth(Upload)}
                        />
                        <Route
                            path="/notifications"
                            component={routeRequiresAuth(Notifications)}
                        />
                        <Route path="*" component={Page404} status={404} />
                    </Switch>
                </ErrorBoundary>
            </ApolloProvider>
        </AppFrame>
    );
};

export default App;
