import React, {useState, useEffect} from 'react';

import { 
  Route,
  BrowserRouter as Router
} from 'react-router-dom';

import {ThemeProvider} from 'styled-components';
import {ThangsHeader, Footer, PrivateRoute} from '@widgets';
import {Home, Login} from '@pages';
import {ThangsMain} from '@themes';


const App = () => {
  return (
    <Router>
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
