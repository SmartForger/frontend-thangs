import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { Route, Router, Switch } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import { Footer } from '@components';
import { Home, Login, Signup, Profile, Model } from '@pages';
import { Newspost } from '@pages/Newspost';
import { Page404 } from '@pages/404';
import { ThangsMain, GlobalStyle } from '@style';
import { graphqlClient } from '@services';
import { createBrowserHistory } from 'history';
import * as pendo from '@vendors/pendo';
import * as fullStory from '@vendors/full-story';
import { SearchResults } from '@pages/SearchResults';

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
                <ThemeProvider theme={ThangsMain}>
                    <GlobalStyle />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/login" component={Login} />
                        <Route path="/signup" component={Signup} exact />
                        <Route
                            path="/signup/:registration"
                            component={Signup}
                        />
                        <Route path="/profile/:id" component={Profile} />
                        <Route path="/model/:id" component={Model} />
                        <Route path="/newspost/:id" component={Newspost} />
                        <Route
                            path="/search/:searchQuery"
                            component={SearchResults}
                        />
                        <Route path="*" component={Page404} status={404} />
                    </Switch>
                    <Footer />
                </ThemeProvider>
            </Router>
        </ApolloProvider>
    );
};

export default App;
