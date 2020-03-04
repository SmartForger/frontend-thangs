import React from 'react';
import { GraphQL, GraphQLProvider } from 'graphql-react';

import { Route, BrowserRouter as Router } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import {
    ThangsHeader,
    Footer,
    PrivateRoute,
    BackgroundImage,
} from '@components';
import { Home, Login, Signup, Details, Profile } from '@pages';
import { ThangsMain, GlobalStyle } from '@style';
import { createAuthenticatedFetch } from '@services';

const graphql = new GraphQL();

const originalFetch = window.fetch;
window.fetch = createAuthenticatedFetch(originalFetch);

const App = () => {
    return (
        <GraphQLProvider graphql={graphql}>
            <Router>
                <GlobalStyle />
                <ThemeProvider theme={ThangsMain}>
                    <ThangsHeader />
                    <BackgroundImage />
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/signup" component={Signup} exact />
                    <Route path="/signup/:registration" component={Signup} />
                    <Route path="/details/:id" component={Details} />
                    <Route path="/profile/:id" component={Profile} />
                    <Footer />
                </ThemeProvider>
            </Router>
        </GraphQLProvider>
    );
};

export default App;
