import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import {ThemeProvider} from 'styled-components';
import './App.css';

import {ThangsHeader, Footer} from './widgets';
import {Home, Login} from './pages';
import {ThangsMain} from './themes';


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
