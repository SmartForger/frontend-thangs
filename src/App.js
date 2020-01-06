import React, {useState, useEffect} from 'react';

import { 
  Route,
  BrowserRouter as Router,
  useHistory 
} from 'react-router-dom';

import {ThemeProvider} from 'styled-components';

import {ThangsHeader, Footer, PrivateRoute} from '@widgets';
import {Home, Login} from '@pages';
import {ThangsMain} from '@themes';
import { authenticationService } from '@services';


const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const history = useHistory();


  useEffect(() => {
    authenticationService.currentUser.subscribe(x => setCurrentUser(x))
  })

  const logout = () => {
    authenticationService.logout();
    history.push('/login');
  }


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
