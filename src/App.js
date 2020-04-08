import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { Route, Router, Switch } from 'react-router-dom';

import { Home, Login, Signup, Profile, Model } from '@pages';
import { ModelPreview } from '@pages/ModelPreview';
import { ModelDetail } from '@pages/Model/ModelDetail';
import { Newspost } from '@pages/Newspost';
import { NewSignup } from '@pages/Signup/NewSignup';
import { NewLogin } from '@pages/Login/NewLogin';
import { Page404 } from '@pages/404';
import { graphqlClient } from '@services';
import { createBrowserHistory } from 'history';
import * as pendo from '@vendors/pendo';
import * as fullStory from '@vendors/full-story';
import { SearchResults } from '@pages/SearchResults';
import { SearchResults as NewSearchResults } from '@pages/SearchResults/NewSearchResults';
import { Profile as NewProfile } from '@pages/Profile/NewProfile';
import { Upload } from '@pages/Upload';
import { Landing } from '@pages/Landing';
import { EditProfile } from '@pages/Profile/EditProfile';
import { RedirectProfile } from '@pages/Profile/RedirectProfile';

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
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/new/login" component={NewLogin} />
                    <Route
                        path="/new/signup/:registrationCode"
                        component={NewSignup}
                        exact
                    />
                    <Route path="/signup" component={Signup} exact />
                    <Route path="/signup/:registration" component={Signup} />
                    <Route path="/profile/:id" component={Profile} />
                    <Route
                        exact
                        path="/new/profile/"
                        component={RedirectProfile}
                    />
                    <Route
                        exact
                        path="/new/profile/edit"
                        component={EditProfile}
                    />
                    <Route path="/new/profile/:id" component={NewProfile} />
                    <Route path="/model/:id" component={Model} />
                    <Route exact path="/new/" component={Landing} />
                    <Route path="/new/model/:id" component={ModelDetail} />
                    <Route
                        path="/new/preview/model/:id"
                        component={ModelPreview}
                    />
                    <Route path="/newspost/:id" component={Newspost} />
                    <Route
                        path="/search/:searchQuery"
                        component={SearchResults}
                    />
                    <Route
                        path="/new/search/:searchQuery"
                        component={NewSearchResults}
                    />
                    <Route path="/new/upload" component={Upload} />
                    <Route path="*" component={Page404} status={404} />
                </Switch>
            </Router>
        </ApolloProvider>
    );
};

export default App;
