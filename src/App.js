import React from 'react';

import { 
  Route,
  BrowserRouter as Router
} from 'react-router-dom';

import {ThemeProvider} from 'styled-components';
import {ThangsHeader, Footer, PrivateRoute, } from '@components';
import {Home, Login} from '@pages';
import {ThangsMain, GlobalStyle} from '@themes';


const App = () => {
  return (
    <Router>
      <GlobalStyle />
      <ThemeProvider theme={ThangsMain} >
        <ThangsHeader/>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
        <Footer />
      </ThemeProvider>
    </Router>
  );
}

export default App;
