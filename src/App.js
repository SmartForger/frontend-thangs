import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { Route, Router, Switch } from 'react-router-dom';

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
} from '@pages';
import { ModelPreview } from '@pages/ModelPreview';
import { ModelDetail } from '@pages/Model/ModelDetail';
import { graphqlClient } from '@services';
import { createBrowserHistory } from 'history';
import * as pendo from '@vendors/pendo';
import * as fullStory from '@vendors/full-story';
import { Upload } from '@pages/Upload';

const history = createBrowserHistory();
const originalFetch = window.fetch;
const client = graphqlClient(originalFetch, history);

const initializeAnalytics = history => {
    pendo.initialize(history);
    fullStory.initialize();
    fullStory.identify();
};

const App = () => {
    initializeAnalytics(history);

    return (
        <ApolloProvider client={client}>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route path="/login" component={Login} />
                    <Route
                        path="/signup/:registrationCode"
                        component={Signup}
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
                    <Route exact path="/profile/edit" component={EditProfile} />
                    <Route path="/profile/:id" component={Profile} />
                    <Route exact path="/profile/" component={RedirectProfile} />
                    <Route path="/model/:id" component={ModelDetail} />
                    <Route path="/preview/model/:id" component={ModelPreview} />
                    <Route path="/newspost/:id" component={Newspost} />
                    <Route
                        path="/search/:searchQuery"
                        component={SearchResults}
                    />
                    <Route path="/upload" component={Upload} />
                    <Route path="*" component={Page404} status={404} />
                </Switch>
            </Router>
        </ApolloProvider>
    );
};

export default App;
