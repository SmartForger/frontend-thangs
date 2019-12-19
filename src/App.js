import React from 'react';
import './App.css';
import {ThangsHeader, Footer} from './widgets';
import {Home} from './pages';
import {ThangsMain} from './themes';
import {ThemeProvider} from 'styled-components';

const App = () => {
  return (
    <ThemeProvider theme={ThangsMain} >
      <ThangsHeader/>
      <Home />
      <Footer>
        Feedback? Click here to tell us what you think
      </Footer>
    </ThemeProvider>
  );
}

export default App;
