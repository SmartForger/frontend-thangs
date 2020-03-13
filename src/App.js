import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';

import { Route, BrowserRouter as Router } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import { ThangsHeader, Footer, BackgroundImage } from '@components';
import { Layout } from '@style';
import { Home, Login, Signup, Details, Profile } from '@pages';
import { ThangsMain, GlobalStyle } from '@style';
import { graphqlClient } from '@services';

const originalFetch = window.fetch;
const client = graphqlClient(originalFetch);

const App = () => {
    return (
        <ApolloProvider client={client}>
            <Router>
                <GlobalStyle />
                <ThemeProvider theme={ThangsMain}>
                    <ThangsHeader />
                    <BackgroundImage />
                    <Layout>
                        <div>
                            <Route exact path="/" component={Home} />
                            <Route path="/login" component={Login} />
                            <Route path="/signup" component={Signup} exact />
                            <Route
                                path="/signup/:registration"
                                component={Signup}
                            />
                            <Route path="/details/:id" component={Details} />
                            <Route path="/profile/:id" component={Profile} />
                        </div>
                    </Layout>
                    <Footer />
                </ThemeProvider>
            </Router>
        </ApolloProvider>
    );
};

export default App;
