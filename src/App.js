import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { Route, Router } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import { ThangsHeader, Footer } from '@components';
import { Home, Login, Signup, Details, Profile, Model } from '@pages';
import { ThangsMain, GlobalStyle } from '@style';
import { graphqlClient } from '@services';
import { createBrowserHistory } from 'history';
import * as pendo from '@vendors/pendo';
import * as fullStory from '@vendors/full-story';

const history = createBrowserHistory();
const originalFetch = window.fetch;
const client = graphqlClient(originalFetch, history);

pendo.initialize(history);
fullStory.initialize();

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Router history={history}>
                <ThemeProvider theme={ThangsMain}>
                    <GlobalStyle />
                    <ThangsHeader />
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} exact />
                    <Route path="/signup/:registration" component={Signup} />
                    <Route path="/details/:id" component={Details} />
                    <Route path="/profile/:id" component={Profile} />
                    <Route path="/model/:id" component={Model} />
                    <Footer />
                </ThemeProvider>
            </Router>
        </ApolloProvider>
    );
};

export default App;
