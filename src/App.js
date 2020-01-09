import React from 'react';

import { 
  Route,
  BrowserRouter as Router
} from 'react-router-dom';

import {ThemeProvider} from 'styled-components';
import {ThangsHeader, Footer, PrivateRoute, BackgroundImage, } from '@components';
import {Home, Login, Details} from '@pages';
import {ThangsMain, GlobalStyle} from '@themes';


const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <ThemeProvider theme={ThangsMain} >
        <ThangsHeader/>
        <BackgroundImage />
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/details/:id" component={Details} />
        <Footer />
      </ThemeProvider>
    </Router>
  );
}

export default App;
